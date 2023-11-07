import { storages } from '../../../utils/zk.utils';

export const getThirdPartyIssuerProfile = async (nonce: number) => {
  if (nonce === 0) throw new Error('Nonce 0 is Targecy issuer');
  if (!storages.issuer) throw new Error('Default not initialized for third party. ');

  return await storages.identityWallet.createProfile(storages.issuer.did, nonce, 'VERIFIER???'); // @todo CHECK THIS
};
