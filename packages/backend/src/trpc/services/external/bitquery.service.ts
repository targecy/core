import {
  GetSmartContractCallsByAddressQuery,
  GetSmartContractCallsByAddressQueryVariables,
  GetTokenHoldingsByAddressQuery,
  GetTokenHoldingsByAddressQueryVariables,
} from 'generated/bitquery.types';
import { DocumentNode, OperationDefinitionNode } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import parse from 'graphql-tag';
import { AddressString } from 'utils';

import { CHAIN, KNOWN_PROTOCOLS, KNOWN_TOKENS } from '../../../constants/contracts.constants';
import { GetSmartContractCallsByAddress, GetTokenHoldingsByAddress } from '../credentials/credentials.graphql';

const getOperationNames = (definitions: DocumentNode['definitions']) =>
  definitions
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    .filter((d): d is OperationDefinitionNode => d.kind === 'OperationDefinition')
    .map((d) => d?.name?.value)
    .filter(Boolean)
    .join(', ');

export const graphqlRequest = async <RequestResult, RequestVariables>({
  document,
  variables,
  timeout = 20000,
}: {
  document: string;
  variables?: RequestVariables;
  timeout?: number;
}): Promise<RequestResult> => {
  const graphqlClient = new GraphQLClient('https://graphql.bitquery.io', {
    headers: {
      'content-type': 'application/json',
      'X-API-KEY': process.env.BITQUERY_API_KEY || '',
    },
    timeout,
  });

  try {
    console.debug(`Sending graphql request. Operations: ${getOperationNames(parse(document).definitions)}`);

    const result = await graphqlClient.request<RequestResult, RequestVariables>(document, variables);
    console.debug(`Ok: graphql request. Operations: ${getOperationNames(parse(document).definitions)}`);

    return result;
  } catch (error) {
    console.error(
      `GraphQL request error, operations: ${getOperationNames(parse(document).definitions)}, error: ${error}`
    );

    throw error;
  }
};

export async function getUsedContractsbyAddress(address: AddressString, from?: Date) {
  const response = await graphqlRequest<
    GetSmartContractCallsByAddressQuery,
    GetSmartContractCallsByAddressQueryVariables
  >({
    document: GetSmartContractCallsByAddress,
    variables: {
      address,
      from,
      network: 'matic',
      contracts: KNOWN_PROTOCOLS.map((p) => p.addresses).flat(),
    },
  });

  const usedContractAddresses = response.ethereum?.smartContractCalls?.map(
    (call) => call.smartContract?.address.address?.toString()
  );

  return KNOWN_PROTOCOLS.filter((p) => p.addresses.some((addr) => usedContractAddresses?.includes(addr)));
}

export async function getTokenHoldings(address: AddressString, from?: Date) {
  const response = await graphqlRequest<GetTokenHoldingsByAddressQuery, GetTokenHoldingsByAddressQueryVariables>({
    document: GetTokenHoldingsByAddress,
    variables: {
      network: 'matic',
      from,
      tokens: KNOWN_TOKENS.map((p) => p.address).flat(),
      receiver: address,
    },
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
      chain: CHAIN.POLYGON,
    })) || []
  );
}
