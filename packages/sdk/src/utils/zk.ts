import path from 'path';

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
  CircuitId,
  core,
  W3CCredential,
} from '@0xpolygonid/js-sdk';
import { Hex, getRandomBytes } from '@iden3/js-crypto';
import { SchemaHash } from '@iden3/js-iden3-core';
import { keccak256 } from '@lumeweb/js-sha3-browser';
import Swal from 'sweetalert2';

export type StoragesSide = 'server' | 'client';

const _userSeed = 'userseedseedseedseedseedseedseed';
const base64StringRegex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

import { TargecyContextType, UserIdentityType, ZkServicesType } from '../components/misc/Context.types';
import { addressZero, BigNumberZero } from '../constants/chain';
import { Ad, Segment } from '../generated/graphql.types';

import { getSeed, saveSeed } from './sharedStorage';
import { base64StringToUint8Array, uint8ArrayToBase64String } from './string';

const operatorKeyByNumber: Record<number, string> = {
  1: '$eq',
  2: '$lt',
  3: '$gt',
  4: '$in',
  5: '$nin',
};

export async function generateZKProof(
  match: ProofCredentialMatch,
  segment: Segment,
  services: ZkServicesType,
  userDID: core.DID
) {
  const proofReqSig = {
    id: Number(segment.id),
    circuitId: CircuitId.AtomicQuerySigV2OnChain,
    optional: false,
    query: {
      allowedIssuers: ['*'],
      type: match.credential.type.length > 1 ? match.credential.type[1] : match.credential.type[0],
      context: match.credential['@context'].filter((context: string) => context.includes('json-ld'))[0],
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

  // Check Proof not used
  // const _proofVerificationResult = await services.proofService.verifyProof(proof, CircuitId.AtomicQuerySigV2OnChain);

  return proof;
}

export function initializeStorages() {
  const ethConnectionConfig = defaultEthConnectionConfig;
  ethConnectionConfig.url = 'https://rpc.ankr.com/polygon_amoy';
  ethConnectionConfig.chainId = 80002; // Amoy chain id
  ethConnectionConfig.contractAddress = '0x1a4cC30f2aA0377b0c3bc9848766D90cb4404124';

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

export async function createUserIdentity(identityWallet: IdentityWallet): Promise<UserIdentityType> {
  const savedSeed: any = await getSeed();
  let seed: Uint8Array;

  if (!savedSeed) {
    seed = getRandomBytes(32);
    // @todo (Martin): It isn't secure to store the seed like this, think an alternative.
    await saveSeed(uint8ArrayToBase64String(seed));
  } else if (base64StringRegex.test(savedSeed)) {
    seed = base64StringToUint8Array(savedSeed);
  } else {
    seed = savedSeed;
  }

  if (seed.length != 32) {
    return Promise.reject('Invalid seed length');
  }

  const identity = await identityWallet.createIdentity({
    method: core.DidMethod.Iden3,
    blockchain: core.Blockchain.Polygon,
    networkId: core.NetworkId.Amoy,
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
  const prefix: string = side === 'server' ? path.resolve(__dirname + '../../public/') : '/';

  const response = await fetch(prefix + file); // Change this to your url

  const uint8Array = new Uint8Array(await response.arrayBuffer());

  return uint8Array;
}

export async function getCircuitStorage(side: StoragesSide) {
  const circuitStorage = new CircuitStorage(new InMemoryDataSource<CircuitData>());

  const [wasm, provingKey, verificationKey] = await Promise.all([
    await fetchBinaryFile(side, 'circuits/credentialAtomicQuerySigV2OnChain/circuit.wasm'),
    await fetchBinaryFile(side, 'circuits/credentialAtomicQuerySigV2OnChain/circuit_final.zkey'),
    await fetchBinaryFile(side, 'circuits/credentialAtomicQuerySigV2OnChain/verification_key.json')
  ])
  await circuitStorage.saveCircuitData(CircuitId.AtomicQuerySigV2OnChain, {
    circuitId: CircuitId.AtomicQuerySigV2OnChain,
    wasm: wasm,
    provingKey: provingKey,
    verificationKey: verificationKey,
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
  segment: Segment
): ProofCredentialMatch | undefined {
  for (const credential of credentials) {
    const schemaHash = getSchemaHashFromCredential(credential);

    if (schemaHash !== BigInt(segment.querySchema)) {
      continue;
    }

    const credentialKeys = Object.keys(credential.credentialSubject);
    const slotKey = credentialKeys[segment.querySlotIndex];
    const slot = credential.credentialSubject[slotKey].toString();
    const value = new Uint8Array(segment.queryValue).toString(); // TODO CHECK THIS

    let match = false;

    switch (Number(segment.queryOperator)) {
      case 1: // EQ
        if (slot === value) {
          return {
            credential,
            credentialSubjectField: slotKey,
            credentialSubjectValue: slot,
            operator: segment.queryOperator,
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
        operator: segment.queryOperator,
      };
  }

  return undefined;
}

export const generateProof = async (context: TargecyContextType, credentials: W3CCredential[], ad: Ad) => {
  if (!context.userIdentity || !context.zkServices) throw new Error('User or zkServices not initialized');

  let proofs = [];
  for (const audience of ad.audiences) {
    for (const proofRequest of audience.segments) {
      const proofCredentialMatch = getValidCredentialByProofRequest(credentials, proofRequest);
      if (!proofCredentialMatch) continue;

      const proof = await generateZKProof(
        proofCredentialMatch,
        proofRequest,
        context.zkServices as ZkServicesType,
        context.userIdentity?.did
      );
      proofs.push({ proof, id: proofRequest.id });
    }
    if (proofs.length === audience.segments.length) break;
    else proofs = []; // Will try next audience
  }

  if (proofs.length === 0 && ad.audiences.length > 0) {
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

  const _data = JSON.stringify([
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

export const consumeAd = async (proofs: ReturnType<typeof generateProof>, ad: Ad, consumeAdFn: any, waitTxFn: any) => {
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

    const _tx = await waitTxFn({ hash: consumeAdResponse.hash });

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
