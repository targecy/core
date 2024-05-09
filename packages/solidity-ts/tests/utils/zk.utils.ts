/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'fs';
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
import { isolatedEnv } from 'hardhat.config';

export type StoragesSide = 'server' | 'client';

const userSeed = 'userseedseedseedseedseedseedseed';
const issuerSeed = 'issuseedseedseedseedseedseedseed';

export function initializeStorages() {
  const ethConnectionConfig = defaultEthConnectionConfig;
  ethConnectionConfig.url = Boolean(isolatedEnv) ? 'http://localhost:8545' : 'https://rpc-mumbai.polygon.technology';
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
  resolvers.register(CredentialStatusType.Iden3OnchainSparseMerkleTreeProof2023, new OnChainResolver([ethConnectionConfig]));
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
    credentialSchema: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v3.json',
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

export async function issueCredential(identityWallet: IdentityWallet, issuerDID: core.DID, claimReq: CredentialRequest) {
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

function fetchBinaryFile(file: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call

  const prefix = path.resolve(__dirname);

  const data = fs.readFileSync(`${prefix}${file}`); // Change this to your url

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const uint8Array = new Uint8Array(data.buffer);

  return uint8Array;
}

export async function getCircuitStorage() {
  const circuitStorage = new CircuitStorage(new InMemoryDataSource<CircuitData>());
  await circuitStorage.saveCircuitData(CircuitId.AtomicQuerySigV2OnChain, {
    circuitId: CircuitId.AtomicQuerySigV2OnChain,
    wasm: fetchBinaryFile('/circuits/credentialAtomicQuerySigV2OnChain/circuit.wasm'),
    provingKey: fetchBinaryFile('/circuits/credentialAtomicQuerySigV2OnChain/circuit_final.zkey'),
    verificationKey: fetchBinaryFile('/circuits/credentialAtomicQuerySigV2OnChain/verification_key.json'),
  });

  return circuitStorage;
}
