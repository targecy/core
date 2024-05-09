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
import { SCHEMAS } from '@backend/constants/schemas/schemas.constant';

export type StoragesSide = 'server' | 'client';

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

export async function issueCredential(
  identityWallet: IdentityWallet,
  issuerDID: core.DID,
  claimReq: CredentialRequest
) {
  return await identityWallet.issueCredential(issuerDID, claimReq);
}

type CredentialRequestType = 'Interests' | 'Profile';
export type InterestCredentialRequestParams = {
  interest: string;
};
export type ProfileCredentialRequestParams = {
  country?: string;
  birthdate?: string;
};

export type CredentialRequestParams = InterestCredentialRequestParams | ProfileCredentialRequestParams;

const isInterestCredentialRequestParams = (params: Record<string, any>): params is InterestCredentialRequestParams => {
  return typeof params === 'object' && 'interest' in params;
};

const isProfileCredentialRequestParams = (params: Record<string, any>): params is ProfileCredentialRequestParams => {
  return typeof params === 'object' && 'country' in params && 'birthdate' in params;
};

export const getWebappCredentialRequest = (
  type: CredentialRequestType,
  userDID: core.DID,
  params: CredentialRequestParams
): CredentialRequest => {
  const credentialRequestBase = {
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: 'https://rhs-staging.polygonid.me',
    },
  };

  switch (type) {
    case 'Interests':
      if (!isInterestCredentialRequestParams(params)) throw new Error('Invalid event params');
      const interestsCredentialSubject: (typeof SCHEMAS)['InterestTargecySchema']['credentialSubject'] = {
        id: `did:iden3:${userDID.id}`,
        interest: params.interest,
      };

      return {
        ...credentialRequestBase,
        credentialSchema: SCHEMAS['InterestTargecySchema'].schemaUrl,
        type: SCHEMAS['InterestTargecySchema'].type,
        credentialSubject: interestsCredentialSubject,
      };

    case 'Profile':
      if (!isProfileCredentialRequestParams(params)) throw new Error('Invalid event params');
      const profileCredentialSubject: (typeof SCHEMAS)['ProfileTargecySchema']['credentialSubject'] = {
        id: `did:iden3:${userDID.id}`,
        country: params.country ?? '',
        birthdate: params.birthdate ?? '',
      };

      return {
        ...credentialRequestBase,
        credentialSchema: SCHEMAS['ProfileTargecySchema'].schemaUrl,
        type: SCHEMAS['ProfileTargecySchema'].type,
        credentialSubject: profileCredentialSubject,
      };
    default:
      throw new Error('Invalid event type');
  }
};
