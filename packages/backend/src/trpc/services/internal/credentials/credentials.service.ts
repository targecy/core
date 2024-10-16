import { W3CCredential } from '@0xpolygonid/js-sdk';
import { DID } from '@iden3/js-iden3-core';

import {
  createActiveOnChainCredential,
  createTokenHoldingCredentialRequest,
  createUsedProtocolCredentialRequest,
} from '../../../../constants/credentials/public.credentials';
import { storages } from '../../../../utils/zk.utils';
import {
  getIsActiveOnChainByAddress,
  getTokenHoldings,
  getUsedContractsbyAddress,
} from '../../external/bitquery.service';
import { sha256 } from '@iden3/js-crypto';

/**
 * Analyzes public on-chain data and issues credentials
 *
 * @param wallet  The wallet address to analyze
 * @returns       An array of W3C credentials
 */
export const getPublicCredentials = async (wallet: string, claimerDid: DID, from?: Date): Promise<W3CCredential[]> => {
  const issuer = storages.issuer;

  if (!issuer) throw new Error('Issuer not initialized');

  return (
    await Promise.all([
      getContractInteractionsCredentials(wallet, claimerDid, issuer.did, from),
      getTokenHoldingsCredentials(wallet, claimerDid, issuer.did, from),
      getActiveOnChainCredentials(wallet, claimerDid, issuer.did, from),
    ])
  ).flat();
};

export const getSubjectHash = (subject: any) => {
  return sha256(new TextEncoder().encode(JSON.stringify(subject))).toString();
};

export async function getContractInteractionsCredentials(
  wallet: string,
  claimerDid: DID,
  issuerDid: DID,
  from?: Date
): Promise<W3CCredential[]> {
  const credentials: W3CCredential[] = [];

  // Protocols Used
  const usedContracts = await getUsedContractsbyAddress(wallet, from);
  for (const protocol of usedContracts) {
    const credentialRequest = createUsedProtocolCredentialRequest(claimerDid, protocol);

    const credentialIssued = await storages.identityWallet.issueCredential(issuerDid, credentialRequest, {
      ipfsGatewayURL: 'https://ipfs.io',
    });

    credentials.push(credentialIssued);
  }

  return credentials;
}

export async function getTokenHoldingsCredentials(
  wallet: string,
  claimerDid: DID,
  issuerDid: DID,
  from?: Date
): Promise<W3CCredential[]> {
  const credentials: W3CCredential[] = [];

  const tokenHoldings = await getTokenHoldings(wallet, from);

  for (const holding of tokenHoldings) {
    const credentialRequest = createTokenHoldingCredentialRequest(claimerDid, holding);

    const credentialIssued = await storages.identityWallet.issueCredential(issuerDid, credentialRequest, {
      ipfsGatewayURL: 'https://ipfs.io',
    });

    await storages.dataStorage.credential.saveCredential(credentialIssued);

    // await storages.credWallet.save(credentialIssued);

    credentials.push(credentialIssued);
  }

  return credentials;
}

export async function getActiveOnChainCredentials(
  wallet: string,
  claimerDid: DID,
  issuerDid: DID,
  from?: Date
): Promise<W3CCredential[]> {
  const credentials: W3CCredential[] = [];

  const isActiveOnChains = await getIsActiveOnChainByAddress(wallet, from);
  for (const isActiveOnChain of isActiveOnChains) {
    if (!isActiveOnChain.isActive) continue;

    const credentialRequest = createActiveOnChainCredential(claimerDid, isActiveOnChain.network);

    const credentialIssued = await storages.identityWallet.issueCredential(issuerDid, credentialRequest, {
      ipfsGatewayURL: 'https://ipfs.io',
    });

    credentials.push(credentialIssued);
  }

  return credentials;
}
