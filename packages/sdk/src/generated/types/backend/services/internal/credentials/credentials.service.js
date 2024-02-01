"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveOnChainCredentials = exports.getTokenHoldingsCredentials = exports.getContractInteractionsCredentials = exports.getSubjectHash = exports.getPublicCredentials = void 0;
const public_credentials_1 = require("../../../../constants/credentials/public.credentials");
const zk_utils_1 = require("../../../../utils/zk.utils");
const bitquery_service_1 = require("../../external/bitquery.service");
const js_crypto_1 = require("@iden3/js-crypto");
/**
 * Analyzes public on-chain data and issues credentials
 *
 * @param wallet  The wallet address to analyze
 * @returns       An array of W3C credentials
 */
const getPublicCredentials = async (wallet, claimerDid, from) => {
    const issuer = zk_utils_1.storages.issuer;
    if (!issuer)
        throw new Error('Issuer not initialized');
    return (await Promise.all([
        getContractInteractionsCredentials(wallet, claimerDid, issuer.did, from),
        getTokenHoldingsCredentials(wallet, claimerDid, issuer.did, from),
        getActiveOnChainCredentials(wallet, claimerDid, issuer.did, from),
    ])).flat();
};
exports.getPublicCredentials = getPublicCredentials;
const getSubjectHash = (subject) => {
    return (0, js_crypto_1.sha256)(new TextEncoder().encode(JSON.stringify(subject))).toString();
};
exports.getSubjectHash = getSubjectHash;
async function getContractInteractionsCredentials(wallet, claimerDid, issuerDid, from) {
    const credentials = [];
    // Protocols Used
    const usedContracts = await (0, bitquery_service_1.getUsedContractsbyAddress)(wallet, from);
    for (const protocol of usedContracts) {
        const credentialRequest = (0, public_credentials_1.createUsedProtocolCredentialRequest)(claimerDid, protocol);
        const credentialIssued = await zk_utils_1.storages.identityWallet.issueCredential(issuerDid, credentialRequest, {
            ipfsGatewayURL: 'https://ipfs.io',
        });
        credentials.push(credentialIssued);
    }
    return credentials;
}
exports.getContractInteractionsCredentials = getContractInteractionsCredentials;
async function getTokenHoldingsCredentials(wallet, claimerDid, issuerDid, from) {
    const credentials = [];
    const tokenHoldings = await (0, bitquery_service_1.getTokenHoldings)(wallet, from);
    for (const holding of tokenHoldings) {
        const credentialRequest = (0, public_credentials_1.createTokenHoldingCredentialRequest)(claimerDid, holding);
        const credentialIssued = await zk_utils_1.storages.identityWallet.issueCredential(issuerDid, credentialRequest, {
            ipfsGatewayURL: 'https://ipfs.io',
        });
        await zk_utils_1.storages.dataStorage.credential.saveCredential(credentialIssued);
        // await storages.credWallet.save(credentialIssued);
        credentials.push(credentialIssued);
    }
    return credentials;
}
exports.getTokenHoldingsCredentials = getTokenHoldingsCredentials;
async function getActiveOnChainCredentials(wallet, claimerDid, issuerDid, from) {
    const credentials = [];
    const isActiveOnChains = await (0, bitquery_service_1.getIsActiveOnChainByAddress)(wallet, from);
    for (const isActiveOnChain of isActiveOnChains) {
        if (!isActiveOnChain.isActive)
            continue;
        const credentialRequest = (0, public_credentials_1.createActiveOnChainCredential)(claimerDid, isActiveOnChain.network);
        const credentialIssued = await zk_utils_1.storages.identityWallet.issueCredential(issuerDid, credentialRequest, {
            ipfsGatewayURL: 'https://ipfs.io',
        });
        credentials.push(credentialIssued);
    }
    return credentials;
}
exports.getActiveOnChainCredentials = getActiveOnChainCredentials;
