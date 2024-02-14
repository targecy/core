import {
  BjjProvider,
  CredentialStorage,
  CredentialWallet,
  defaultEthConnectionConfig,
  type Identity,
  IdentityStorage,
  IdentityWallet,
  InMemoryDataSource,
  InMemoryMerkleTreeStorage,
  InMemoryPrivateKeyStore,
  KMS,
  KmsKeyType,
  type Profile,
  CredentialStatusResolverRegistry,
  IssuerResolver,
  RHSResolver,
  OnChainResolver,
  AgentResolver,
  EthStateStorage,
  type CredentialRequest,
  CredentialStatusType,
  type core,
  type W3CCredential,
} from '@0xpolygonid/js-sdk';

export type StoragesSide = 'server' | 'client';

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

export async function issueCredential(
  identityWallet: IdentityWallet,
  issuerDID: core.DID,
  claimReq: CredentialRequest
) {
  return await identityWallet.issueCredential(issuerDID, claimReq);
}
