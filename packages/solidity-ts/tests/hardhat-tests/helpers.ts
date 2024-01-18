import { CircuitId, CredentialRequest, CredentialStatusType, ZeroKnowledgeProofResponse } from '@0xpolygonid/js-sdk';
import { EventFragment, Interface } from '@ethersproject/abi';
import { ContractTransactionReceipt } from 'ethers';
import { TargecyEvents__factory } from 'generated/contract-types';

import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';
import { DataTypes } from '~generated/contract-types/contracts/core/Targecy';
import { createIssuerIdentity, createUserIdentity, getCircuitStorage, initProofService, initializeStorages } from '~tests/utils/zk.utils';

export const defaultIssuer = 1313424234234234234n;
export const relayerAddress = '0x3bBF2d68CBb8C813Cbc4b4237abFeeE7023279ae';

export function decodeEvents(receipt?: ContractTransactionReceipt | null): EventFragment[] {
  if (receipt?.logs == null) return [];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const iface = new Interface(TargecyEvents__factory.abi);

  return receipt.logs?.map(
    (log) =>
      iface.parseLog({
        topics: log.topics as string[],
        data: log.data,
      }).eventFragment
  );
}

export function getTestAudience(): DataTypes.SegmentStruct {
  return {
    metadataURI: '',
    issuer: defaultIssuer,
    query: {
      schema: 1,
      slotIndex: 2, // documentType
      operator: 1, // eq
      value: [99],
      circuitId: CircuitId.AtomicQuerySigV2OnChain,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function initZKServices() {
  const storages = initializeStorages();
  const circuitStorage = await getCircuitStorage();
  const issuerIdentity = await createIssuerIdentity(storages.identityWallet);
  const userIdentity = await createUserIdentity(storages.identityWallet);
  const proofService = initProofService(storages.identityWallet, storages.credWallet, storages.dataStorage.states, circuitStorage);

  return {
    storages,
    circuitStorage,
    issuerIdentity,
    userIdentity,
    proofService,
  };
}

export type ZKServices = Awaited<ReturnType<typeof initZKServices>>;

export async function getTestProof(zkServices: ZKServices, audienceId: number): Promise<ZeroKnowledgeProofResponse> {
  const credentialRequest: CredentialRequest = {
    credentialSchema: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v3.json',
    type: 'KYCAgeCredential',
    credentialSubject: {
      id: `did:iden3:${zkServices.userIdentity.did.id.toString()}`,
      birthday: 19960424,
      documentType: 99,
    },
    expiration: 12345678888,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: 'https://rhs-staging.polygonid.me',
    },
  };

  const credential = await zkServices.storages.identityWallet.issueCredential(zkServices.issuerIdentity.did, credentialRequest);
  await zkServices.storages.dataStorage.credential.saveCredential(credential);

  const proofReqSig = {
    id: Number(audienceId),
    circuitId: CircuitId.AtomicQuerySigV2OnChain,
    optional: false,
    query: {
      allowedIssuers: ['*'],
      type: credential.type,
      context: credential['@context'],
      credentialSubject: {
        documentType: {
          $eq: 99,
        },
      },
    },
  };

  const proof = await zkServices.proofService.generateProof(proofReqSig, zkServices.userIdentity.did, {
    credential: credential,
    challenge: BigInt(1),
    skipRevocation: false,
  });

  console.log('    Generating proof > takes ~5 seconds');

  proof.proof.pi_a = proof.proof.pi_a.slice(0, 2);
  proof.proof.pi_b = [
    [proof.proof.pi_b[0]?.[1]?.toString(), proof.proof.pi_b[0]?.[0]?.toString()],
    [proof.proof.pi_b[1]?.[1]?.toString(), proof.proof?.pi_b[1]?.[0]?.toString()],
  ];
  proof.proof.pi_c = proof.proof.pi_c.slice(0, 2);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return proof;
}
