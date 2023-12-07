import { GraphQLClient } from 'graphql-request';

import { KNOWN_PROTOCOLS, KNOWN_TOKENS, SupportedNetworksIterable } from '../../../constants/contracts.constants';
import { getSdk } from '../../../generated/bitquery.types';
import { AddressString } from '../../../utils';

const url = process.env.BITQUERY_URL || '';
const headers: Record<string, string> = {
  'content-type': 'application/json',
  'X-API-KEY': process.env.BITQUERY_API_KEY || '',
};

const bitqueryApi = getSdk(
  new GraphQLClient(url, {
    headers,
  })
);

export async function getUsedContractsbyAddress(address: AddressString, from?: Date) {
  const promises = await Promise.all(
    SupportedNetworksIterable.map(async (network) => {
      const response = await bitqueryApi.GetSmartContractCallsByAddress({
        address,
        from,
        network,
        contracts: KNOWN_PROTOCOLS[network].map((p) => p.addresses).flat(),
      });

      const usedContractAddresses = response.ethereum?.smartContractCalls?.map(
        (call) => call.smartContract?.address.address?.toString()
      );

      return KNOWN_PROTOCOLS[network].filter((p) => p.addresses.some((addr) => usedContractAddresses?.includes(addr)));
    })
  );

  return promises.flat();
}

export async function getIsActiveOnChainByAddress(address: AddressString, from?: Date) {
  const promises = await Promise.all(
    SupportedNetworksIterable.map(async (network) => {
      const response = await bitqueryApi.GetTransactions({
        network,
        address,
        from,
      });

      return {
        network,
        isActive: (response.ethereum?.transactions?.length ?? 0) > 0,
      };
    })
  );

  return promises.flat();
}

export async function getTokenHoldings(address: AddressString, from?: Date) {
  const promises = await Promise.all(
    SupportedNetworksIterable.map(async (network) => {
      const response = await bitqueryApi.GetTokenHoldingsByAddress({
        network,
        from,
        tokens: KNOWN_TOKENS[network].map((p) => p.address).flat(),
        receiver: address,
      });

      return (
        response.ethereum?.transfers?.map((transfer) => ({
          token: transfer.currency?.address,
          symbol: transfer.currency?.symbol,
          tokenId: transfer.currency?.tokenId,
          type: transfer.currency?.tokenType,
          amount: transfer.amount,
          tx: transfer.transaction?.hash,
          height: transfer.block?.height,
          timestamp: transfer.block?.timestamp?.time,
          chain: network,
        })) || []
      );
    })
  );

  return promises.flat();
}
