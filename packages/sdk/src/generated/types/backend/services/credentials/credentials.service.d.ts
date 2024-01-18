import { W3CCredential } from '@0xpolygonid/js-sdk';
import { DID } from '@iden3/js-iden3-core';
/**
 * Analyzes public on-chain data and issues credentials
 *
 * @param wallet  The wallet address to analyze
 * @returns       An array of W3C credentials
 */
export declare const getPublicCredentials: (wallet: string, claimerDid: DID, from?: Date) => Promise<W3CCredential[]>;
export declare function getContractInteractionsCredentials(wallet: string, claimerDid: DID, issuerDid: DID, from?: Date): Promise<W3CCredential[]>;
export declare function getTokenHoldingsCredentials(wallet: string, claimerDid: DID, issuerDid: DID, from?: Date): Promise<W3CCredential[]>;
export declare function getActiveOnChainCredentials(wallet: string, claimerDid: DID, issuerDid: DID, from?: Date): Promise<W3CCredential[]>;
