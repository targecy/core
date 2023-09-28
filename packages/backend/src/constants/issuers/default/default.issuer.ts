import { CredentialStatusType, byteEncoder, core } from '@0xpolygonid/js-sdk';
import { storages } from 'utils/zk.utils';

export const getDefaultIssuerIdentity = async () => {
  const seedPhraseIssuer: Uint8Array = byteEncoder.encode(process.env.IDENTITIES_SEED);
  return await storages.identityWallet.createIdentity({
    method: core.DidMethod.Iden3,
    blockchain: core.Blockchain.Polygon,
    networkId: core.NetworkId.Mumbai,
    seed: seedPhraseIssuer,
    revocationOpts: {
      type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
      id: 'https://rhs-staging.polygonid.me',
    },
  });
};

export const getDefaultIssuerProfile = async () => {
  return await storages.identityWallet.createProfile((await defaultIssuer).did, 0, 'VERIFIER???'); // @todo CHECK THIS
};

export const getThirdPartyIssuerProfile = async (nonce: number) => {
  if (nonce == 0) throw new Error('Nonce 0 is Targecy issuer');

  return await storages.identityWallet.createProfile((await defaultIssuer).did, nonce, 'VERIFIER???'); // @todo CHECK THIS
};

export const defaultIssuer = getDefaultIssuerIdentity();
