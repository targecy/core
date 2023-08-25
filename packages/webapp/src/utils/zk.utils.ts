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
  type W3CCredential,
  type IStateStorage,
  ProofService,
  type ICircuitStorage,
  CredentialStatusResolverRegistry,
  IssuerResolver,
  RHSResolver,
  OnChainResolver,
  AgentResolver,
  byteEncoder,
  EthStateStorage,
  type CredentialRequest,
  CircuitId,
  type IIdentityWallet,
  type ZeroKnowledgeProofRequest,
  core,
  CredentialStatusType,
  CircuitStorage,
  type CircuitData,
} from '@0xpolygonid/js-sdk';
import { Hex } from '@iden3/js-crypto';
import { SchemaHash } from '@iden3/js-iden3-core';
import { keccak256 } from '@lumeweb/js-sha3-browser';

import { ZkpRequest } from '~~/generated/graphql.types';

export type StoragesSide = 'server' | 'client';

const userSeed = 'userseedseedseedseedseedseedseed';
const issuerSeed = 'issuseedseedseedseedseedseedseed';

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

export async function createIssuerIdentity(wallet: IdentityWallet) {
  const seedPhraseIssuer: Uint8Array = byteEncoder.encode(issuerSeed);
  return await wallet.createIdentity({
    method: core.DidMethod.Iden3,
    blockchain: core.Blockchain.Polygon,
    networkId: core.NetworkId.Mumbai,
    seed: seedPhraseIssuer,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: 'https://rhs-staging.polygonid.me',
    },
  });
}

export async function createUserIdentity(identityWallet: IdentityWallet) {
  const seedPhraseUser: Uint8Array = byteEncoder.encode(userSeed);
  return await identityWallet.createIdentity({
    method: core.DidMethod.Iden3,
    blockchain: core.Blockchain.Polygon,
    networkId: core.NetworkId.Mumbai,
    seed: seedPhraseUser,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: 'https://rhs-staging.polygonid.me',
    },
  });
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

export async function issueCredential(
  identityWallet: IdentityWallet,
  issuerDID: core.DID,
  claimReq: CredentialRequest
) {
  return await identityWallet.issueCredential(issuerDID, claimReq);
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
