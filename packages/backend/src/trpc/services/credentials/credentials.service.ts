import { KNOWN_PROTOCOLS } from 'constants/contracts.constants';
import {
  createERC1155HoldingCredentialRequest,
  createUsedProtocolCredentialRequest,
} from 'constants/credentials/public.credentials';

import { W3CCredential } from '@0xpolygonid/js-sdk';
import { storages } from 'utils/zk.utils';

import { getUsedContractsbyAddress } from '../external/bitquery.service';
import { getERC1155Holdings } from '../external/polygonscan.service';

/**
 * Analyzes public on-chain data and issues credentials
 *
 * @param wallet  The wallet address to analyze
 * @returns       An array of W3C credentials
 */
export const getPublicCredentials = async (wallet: string, claimerDid: string): Promise<W3CCredential[]> => {
  const issuer = storages.issuer;
  if (!issuer) throw new Error('Issuer not initialized');

  const credentials: W3CCredential[] = [];

  // Protocols Used
  const usedContracts = await getUsedContractsbyAddress(wallet, KNOWN_PROTOCOLS);
  for (const protocol of usedContracts) {
    const credentialRequest = createUsedProtocolCredentialRequest(claimerDid, protocol);

    const credentialIssued = await storages.identityWallet.issueCredential(issuer.did, credentialRequest, {
      ipfsGatewayURL: 'https://ipfs.io',
    });

    credentials.push(credentialIssued);
  }

  const erc1155holdings = await getERC1155Holdings(wallet);
  for (const holding of erc1155holdings) {
    const credentialRequest = createERC1155HoldingCredentialRequest(claimerDid, holding);

    const credentialIssued = await storages.identityWallet.issueCredential(issuer.did, credentialRequest, {
      ipfsGatewayURL: 'https://ipfs.io',
    });

    const tree = credentialIssued.getIden3SparseMerkleTreeProof();

    console.log(tree);

    await storages.dataStorage.credential.saveCredential(credentialIssued);

    // await storages.credWallet.save(credentialIssued);

    console.log(credentialIssued);

    credentials.push(credentialIssued);
  }

  return Promise.resolve(credentials);
};
