import { KNOWN_PROTOCOLS } from 'constants/contracts.constants';
import { createUsedProtocolCredentialRequest } from 'constants/credentials/public.credentials';
import { getDefaultIssuerProfile } from 'constants/issuers/default/default.issuer';

import { W3CCredential } from '@0xpolygonid/js-sdk';
import { storages } from 'utils/zk.utils';

import { getUsedContractsbyAddress } from '../external/bitquery.service';

/**
 * Analyzes public on-chain data and issues credentials
 *
 * @param wallet  The wallet address to analyze
 * @returns       An array of W3C credentials
 */
export const getPublicCredentials = async (wallet: string, claimerDid: string): Promise<W3CCredential[]> => {
  return Promise.all(
    (await getUsedContractsbyAddress(wallet, KNOWN_PROTOCOLS)).map(async (protocol) => {
      const credentialRequest = createUsedProtocolCredentialRequest(claimerDid, protocol);

      const credentialIssued = await storages.identityWallet.issueCredential(
        await getDefaultIssuerProfile(),
        credentialRequest
      );

      return credentialIssued;
    })
  );
};
