import path from 'path';

import Swal from 'sweetalert2';
import {
  BjjProvider,
  CredentialStorage,
  CredentialWallet,
  defaultEthConnectionConfig,
  type ICredentialWallet,
  type Identity,
  IdentityStorage,
  IdentityWallet,
  InMemoryDataSource,
  InMemoryMerkleTreeStorage,
  InMemoryPrivateKeyStore,
  KMS,
  KmsKeyType,
  type Profile,
  type IStateStorage,
  ProofService,
  type ICircuitStorage,
  CredentialStatusResolverRegistry,
  IssuerResolver,
  RHSResolver,
  OnChainResolver,
  AgentResolver,
  EthStateStorage,
  type CredentialRequest,
  type IIdentityWallet,
  type ZeroKnowledgeProofRequest,
  CredentialStatusType,
  CircuitStorage,
  type CircuitData,
} from '@0xpolygonid/js-sdk';
import { Hex, getRandomBytes } from '@iden3/js-crypto';
import { SchemaHash } from '@iden3/js-iden3-core';
import { keccak256 } from '@lumeweb/js-sha3-browser';

export type StoragesSide = 'server' | 'client';

const userSeed = 'userseedseedseedseedseedseedseed';

import { CircuitId, core, W3CCredential } from '@0xpolygonid/js-sdk';

import { TargecyContextType } from '../components/misc/Context';
import { addressZero, BigNumberZero } from '../constants/chain';
import { Ad, ZkpRequest } from '../generated/graphql.types';

import { ZkServicesType } from './context';
import { getSeed, saveSeed } from './sharedStorage';
import { base64StringToUint8Array, uint8ArrayToBase64String } from './string';

// export async function requestPublicCredentials(userDID?: string, wallet?: string, services?: ZkServicesType) {
//   if (!services) throw new Error('Services not initialized');
//   if (!userDID) throw new Error('User DID or signature not provided');

//   const credentials: W3CCredential[] = await backendTrpcClient.credentials.getPublicCredentials.query({
//     did: userDID,
//     signature: "SIG",
//     wallet: wallet ?? '0xEB71ed911e4dFc35Da80103a72fE983C8c709F33',
//   }, {});

//   await services.dataStorage.credential.saveAllCredentials(credentials);
// }

export function cloneCredential(credential: W3CCredential) {
  const cloned = new W3CCredential();

  const keys = Object.keys(credential) as (keyof W3CCredential)[];
  for (const key of keys) {
    if (credential[key]) {
      cloned[key] = credential[key] as any;
    }
  }
  return cloned;
}

const operatorKeyByNumber: Record<number, string> = {
  1: '$eq',
  2: '$lt',
  3: '$gt',
  4: '$in',
  5: '$nin',
};

export async function generateZKProof(
  match: ProofCredentialMatch,
  zkpRequest: ZkpRequest,
  services: ZkServicesType,
  userDID: core.DID
) {
  const proofReqSig = {
    id: Number(zkpRequest.id),
    circuitId: CircuitId.AtomicQuerySigV2OnChain,
    optional: false,
    query: {
      allowedIssuers: ['*'],
      type: match.credential.type,
      context: match.credential['@context'],
      credentialSubject: {
        [match.credentialSubjectField]: {
          [operatorKeyByNumber[match.operator]]: match.credentialSubjectValue,
        },
      },
    },
  };

  await services.credWallet.save(match.credential);

  const proof = await services.proofService.generateProof(proofReqSig, userDID, {
    credential: match.credential,
    challenge: BigInt(10000000),
    skipRevocation: true,
  });

  proof.proof.pi_a = proof.proof.pi_a.slice(0, 2);
  proof.proof.pi_b = [
    [proof.proof.pi_b[0]?.[1]?.toString() || '', proof.proof.pi_b[0]?.[0]?.toString() || ''],
    [proof.proof.pi_b[1]?.[1]?.toString() || '', proof.proof?.pi_b[1]?.[0]?.toString() || ''],
  ];
  proof.proof.pi_c = proof.proof.pi_c.slice(0, 2);

  // Check Proof
  const proofVerificationResult = await services.proofService.verifyProof(proof, CircuitId.AtomicQuerySigV2OnChain);

  return proof;
}

export function initializeStorages() {
  const ethConnectionConfig = defaultEthConnectionConfig;
  ethConnectionConfig.url = 'https://rpc.ankr.com/polygon_mumbai';
  ethConnectionConfig.chainId = 80001;
  ethConnectionConfig.contractAddress = '0x134B1BE34911E39A8397ec6289782989729807a4';

  const dataStorage = {
    credential: new CredentialStorage(new InMemoryDataSource<W3CCredential>()),
    identity: new IdentityStorage(new InMemoryDataSource<Identity>(), new InMemoryDataSource<Profile>()),
    mt: new InMemoryMerkleTreeStorage(40),
    states: new EthStateStorage(ethConnectionConfig),
  };

  const memoryKeyStore = new InMemoryPrivateKeyStore();
  const bjjProvider = new BjjProvider(KmsKeyType.BabyJubJub, memoryKeyStore);
  const kms = new KMS();
  kms.registerKeyProvider(KmsKeyType.BabyJubJub, bjjProvider);

  // Initialize credential wallet with status resolvers
  const resolvers = new CredentialStatusResolverRegistry();
  resolvers.register(CredentialStatusType.SparseMerkleTreeProof, new IssuerResolver());
  resolvers.register(CredentialStatusType.Iden3ReverseSparseMerkleTreeProof, new RHSResolver(dataStorage.states));
  resolvers.register(
    CredentialStatusType.Iden3OnchainSparseMerkleTreeProof2023,
    new OnChainResolver([ethConnectionConfig])
  );
  resolvers.register(CredentialStatusType.Iden3commRevocationStatusV1, new AgentResolver());
  const credWallet = new CredentialWallet(dataStorage, resolvers);

  const identityWallet = new IdentityWallet(kms, dataStorage, credWallet);

  return { credWallet, identityWallet, dataStorage };
}

export type UserIdentityType = Awaited<ReturnType<typeof createUserIdentity>>;

export async function createUserIdentity(identityWallet: IdentityWallet) {
  const savedSeed = await getSeed();
  let seed: Uint8Array;

  if (!savedSeed) {
    seed = getRandomBytes(32);
    // @todo (Martin): It isn't secure to store the seed like this, think an alternative.
    await saveSeed(uint8ArrayToBase64String(seed));
  } else {
    seed = base64StringToUint8Array(savedSeed);
  }

  if (seed.length !== 32) throw new Error('Invalid seed length');

  const identity = await identityWallet.createIdentity({
    method: core.DidMethod.Iden3,
    blockchain: core.Blockchain.Polygon,
    networkId: core.NetworkId.Mumbai,
    seed,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: 'https://rhs-staging.polygonid.me',
    },
  });

  return identity;
}

export function createCredentialRequest(id: string) {
  const claimReq: CredentialRequest = {
    credentialSchema:
      'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v3.json',
    type: 'KYCAgeCredential',
    credentialSubject: {
      id: 'did:iden3:' + id,
      birthday: 19960424,
      documentType: 99,
    },
    expiration: 12345678888,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: 'https://rhs-staging.polygonid.me',
    },
  };

  return claimReq;
}

export function createKYCAgeCredentialProofRequest(circuitId: CircuitId, type: string): ZeroKnowledgeProofRequest {
  return {
    id: 1,
    circuitId,
    optional: false,
    query: {
      allowedIssuers: ['*'],
      type,
      context: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
      credentialSubject: {
        documentType: {
          $eq: 99,
        },
      },
    },
  };
}

export function initProofService(
  identityWallet: IIdentityWallet,
  credentialWallet: ICredentialWallet,
  stateStorage: IStateStorage,
  circuitStorage: ICircuitStorage
): ProofService {
  return new ProofService(identityWallet, credentialWallet, circuitStorage, stateStorage);
}

async function fetchBinaryFile(side: StoragesSide, file: string) {
  const prefix = side === 'server' ? path.resolve(__dirname + '../../public/') : '/';

  const response = await fetch(prefix + file); // Change this to your url

  const uint8Array = new Uint8Array(await response.arrayBuffer());

  return uint8Array;
}

export async function getCircuitStorage(side: StoragesSide) {
  const circuitStorage = new CircuitStorage(new InMemoryDataSource<CircuitData>());
  await circuitStorage.saveCircuitData(CircuitId.AtomicQuerySigV2OnChain, {
    circuitId: CircuitId.AtomicQuerySigV2OnChain,
    wasm: await fetchBinaryFile(side, 'circuits/credentialAtomicQuerySigV2OnChain/circuit.wasm'),
    provingKey: await fetchBinaryFile(side, 'circuits/credentialAtomicQuerySigV2OnChain/circuit_final.zkey'),
    verificationKey: await fetchBinaryFile(side, 'circuits/credentialAtomicQuerySigV2OnChain/verification_key.json'),
  });

  return circuitStorage;
}

/**
 * Based on https://github.com/0xPolygonID/js-sdk/blob/main/src/schema-processor/json/parser.ts#L109
 */
export function getSchemaHashFromCredential(W3Credential: W3CCredential) {
  if (!W3Credential.credentialSchema?.type) throw new Error('Missing credentialSchema.type');

  const byteEncoder = new TextEncoder();

  const schemaId = byteEncoder.encode(W3Credential.credentialSchema?.type);

  const sHash = Hex.decodeString(keccak256(schemaId));

  const schemaHashEntity = new SchemaHash(sHash.slice(sHash.length - 16, sHash.length));

  return schemaHashEntity.bigInt();
}

export type ProofCredentialMatch = {
  credential: W3CCredential;
  credentialSubjectField: string;
  credentialSubjectValue: string;
  operator: number;
};

export function getValidCredentialByProofRequest(
  credentials: W3CCredential[],
  zkprequest: ZkpRequest
): ProofCredentialMatch | undefined {
  for (const credential of credentials) {
    const schemaHash = getSchemaHashFromCredential(credential);

    if (schemaHash !== BigInt(zkprequest.query_schema)) {
      continue;
    }

    const credentialKeys = Object.keys(credential.credentialSubject);
    const slotKey = credentialKeys[zkprequest.query_slotIndex];
    const slot = credential.credentialSubject[slotKey].toString();
    const value = new Uint8Array(zkprequest.query_value).toString(); // TODO CHECK THIS

    let match = false;

    switch (Number(zkprequest.query_operator)) {
      case 1: // EQ
        if (slot === value) {
          return {
            credential,
            credentialSubjectField: slotKey,
            credentialSubjectValue: slot,
            operator: zkprequest.query_operator,
          };
        }
        break;
      case 2: // LT
        if (slot < value) {
          match = true;
        }
        break;
      case 3: // GT
        if (slot > value) {
          match = true;
        }
        break;
      case 4: // IN
        if (slot.includes(value)) {
          match = true;
        }
        break;
      case 5: // NOT IN
        if (!slot.includes(value)) {
          match = true;
        }
        break;
      default:
        throw new Error('Invalid operator');
    }
    if (match)
      return {
        credential,
        credentialSubjectField: slotKey,
        credentialSubjectValue: slot,
        operator: zkprequest.query_operator,
      };
  }

  return undefined;
}

export const generateProof = async (context: TargecyContextType, credentials: W3CCredential[], ad: Ad) => {
  if (!context.userIdentity || !context.zkServices) throw new Error('User or zkServices not initialized');

  let proofs = [];
  for (const targetGroup of ad.targetGroups) {
    for (const proofRequest of targetGroup.zkRequests) {
      const proofCredentialMatch = getValidCredentialByProofRequest(credentials, proofRequest);
      if (!proofCredentialMatch) continue;

      const proof = await generateZKProof(
        proofCredentialMatch,
        proofRequest,
        context.zkServices,
        context.userIdentity?.did
      );
      proofs.push({ proof, id: proofRequest.id });
    }
    if (proofs.length === targetGroup.zkRequests.length) break;
    else proofs = []; // Will try next target group
  }

  if (proofs.length === 0 && ad.targetGroups.length > 0) {
    await Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
    }).fire({
      icon: 'error',
      title: 'No valid credentials for this ad',
      padding: '10px 20px',
    });
    return [];
  }

  return proofs;
};

export const consumeAdThroughRelayer = async (proofs: ReturnType<typeof generateProof>, ad: Ad) => {
  const awaitedProofs = await proofs;

  const data = JSON.stringify([
    BigInt(ad.id),
    {
      percentage: BigNumberZero,
      publisherVault: addressZero, // Just for testing
    },
    {
      // requestIds: proofs.map((proof) => proof.id),
      inputs: awaitedProofs.map((proof) => proof.proof.pub_signals),
      a: awaitedProofs.map((proof) => proof.proof.proof.pi_a),
      b: awaitedProofs.map((proof) => proof.proof.proof.pi_b),
      c: awaitedProofs.map((proof) => proof.proof.proof.pi_c),
    },
  ]);

  try {
    // const response = await relayerTrpcClient.txs.send.mutate({
    //   signature: '',
    //   data,
    // });

    await Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
    }).fire({
      icon: 'success',
      title: `Rewards requested successfully. Hash: ${'response'}`,
      padding: '10px 20px',
    });
  } catch (e) {
    await Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
    }).fire({
      icon: 'error',
      title: `Error requesting rewards through relayer`,
      padding: '10px 20px',
    });
    console.error(e);
  }
};

export const consumeAd = async (
  proofs: ReturnType<typeof generateProof>,
  ad: Ad,
  consumeAdFn: Function,
  waitTxFn: Function
) => {
  const awaitedProofs = await proofs;

  try {
    const consumeAdResponse = await consumeAdFn({
      args: [
        BigInt(ad.id),
        {
          percentage: BigNumberZero,
          publisherVault: addressZero, // Just for testing
        },
        {
          // requestIds: proofs.map((proof) => proof.id),
          inputs: awaitedProofs.map((proof) => proof.proof.pub_signals),
          a: awaitedProofs.map((proof) => proof.proof.proof.pi_a),
          b: awaitedProofs.map((proof) => proof.proof.proof.pi_b),
          c: awaitedProofs.map((proof) => proof.proof.proof.pi_c),
        },
      ],
    });

    const tx = await waitTxFn({ hash: consumeAdResponse.hash });

    await Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
    }).fire({
      icon: 'success',
      title: `Rewards requested successfully. Hash: ${consumeAdResponse.hash}`,
      padding: '10px 20px',
    });
  } catch (e) {
    await Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
    }).fire({
      icon: 'error',
      title: `Error requesting rewards`,
      padding: '10px 20px',
    });
    console.error(e);
  }
};
