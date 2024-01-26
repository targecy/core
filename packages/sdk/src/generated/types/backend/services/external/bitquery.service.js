"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenHoldings = exports.getIsActiveOnChainByAddress = exports.getUsedContractsbyAddress = void 0;
const graphql_request_1 = require("graphql-request");
const contracts_constants_1 = require("../../../constants/contracts.constants");
const bitquery_types_1 = require("../../../generated/bitquery.types");
const url = process.env.BITQUERY_URL || '';
const headers = {
    'content-type': 'application/json',
    'X-API-KEY': process.env.BITQUERY_API_KEY || '',
};
const bitqueryApi = (0, bitquery_types_1.getSdk)(new graphql_request_1.GraphQLClient(url, {
    headers,
}));
async function getUsedContractsbyAddress(address, from) {
    const promises = await Promise.all(contracts_constants_1.SupportedNetworksIterable.map(async (network) => {
        const response = await bitqueryApi.GetSmartContractCallsByAddress({
            address,
            from,
            network,
            contracts: contracts_constants_1.KNOWN_PROTOCOLS[network].map((p) => p.addresses).flat(),
        });
        const usedContractAddresses = response.ethereum?.smartContractCalls?.map((call) => call.smartContract?.address.address?.toString());
        return contracts_constants_1.KNOWN_PROTOCOLS[network].filter((p) => p.addresses.some((addr) => usedContractAddresses?.includes(addr)));
    }));
    return promises.flat();
}
exports.getUsedContractsbyAddress = getUsedContractsbyAddress;
async function getIsActiveOnChainByAddress(address, from) {
    const promises = await Promise.all(contracts_constants_1.SupportedNetworksIterable.map(async (network) => {
        const response = await bitqueryApi.GetTransactions({
            network,
            address,
            from,
        });
        return {
            network,
            isActive: (response.ethereum?.transactions?.length ?? 0) > 0,
        };
    }));
    return promises.flat();
}
exports.getIsActiveOnChainByAddress = getIsActiveOnChainByAddress;
async function getTokenHoldings(address, from) {
    const promises = await Promise.all(contracts_constants_1.SupportedNetworksIterable.map(async (network) => {
        const response = await bitqueryApi.GetTokenHoldingsByAddress({
            network,
            from,
            tokens: contracts_constants_1.KNOWN_TOKENS[network].map((p) => p.address).flat(),
            receiver: address,
        });
        return (response.ethereum?.transfers?.map((transfer) => ({
            token: transfer.currency?.address,
            symbol: transfer.currency?.symbol,
            tokenId: transfer.currency?.tokenId,
            type: transfer.currency?.tokenType,
            amount: transfer.amount,
            tx: transfer.transaction?.hash,
            height: transfer.block?.height,
            timestamp: transfer.block?.timestamp?.time,
            chain: network,
        })) || []);
    }));
    return promises.flat();
}
exports.getTokenHoldings = getTokenHoldings;
