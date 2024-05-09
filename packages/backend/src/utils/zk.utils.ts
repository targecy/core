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
  type W3CCredential,
  CredentialStatusResolverRegistry,
  IssuerResolver,
  RHSResolver,
  OnChainResolver,
  AgentResolver,
  EthStateStorage,
  CredentialStatusType,
  CredentialRequest,
  core,
  byteEncoder,

} from '@0xpolygonid/js-sdk';
import { DID } from '@iden3/js-iden3-core';

export async function initializeStorages() {
  const ethConnectionConfig = defaultEthConnectionConfig;
  ethConnectionConfig.url = 'https://rpc.ankr.com/polygon_amoy';
  ethConnectionConfig.chainId = 80002; // Amoy chain id
  ethConnectionConfig.contractAddress = '0x1a4cC30f2aA0377b0c3bc9848766D90cb4404124';

  const dataStorage = {
    credential: new CredentialStorage(new InMemoryDataSource<W3CCredential>()),
    identity: new IdentityStorage(new InMemoryDataSource<Identity>(), new InMemoryDataSource<Profile>()),
    mt: new InMemoryMerkleTreeStorage(40),
    states: new EthStateStorage(defaultEthConnectionConfig),
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

  const seedPhraseIssuer: Uint8Array = byteEncoder.encode(process.env.IDENTITIES_SEED);

  const issuer = await identityWallet.createIdentity({
    method: core.DidMethod.Iden3,
    blockchain: core.Blockchain.Polygon,
    networkId: core.NetworkId.Amoy,
    seed: seedPhraseIssuer,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: 'https://rhs-staging.polygonid.me',
    },
  });

  if (!issuer) throw new Error('Could not create issuer');

  console.log('Issuer:', issuer.did.id, DID.idFromDID(issuer.did).bigInt());

  const defaultProfile = await identityWallet.createProfile(issuer.did, 0, 'DEFAULT');

  return { credWallet, identityWallet, dataStorage, issuer, defaultProfile };
}

const initStorages = async () => await initializeStorages();

export let storages: Awaited<ReturnType<typeof initializeStorages>>;

initStorages()
  .then((res) => {
    storages = res;
  })
  .catch((e) => console.log(e));

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
