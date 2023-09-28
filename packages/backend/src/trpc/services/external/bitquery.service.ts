import { KNOWN_PROTOCOL } from 'constants/contracts.constants';

import {
  GetSmartContractCallsByAddressQuery,
  GetSmartContractCallsByAddressQueryVariables,
} from 'generated/bitquery.types';
import { DocumentNode, OperationDefinitionNode } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import parse from 'graphql-tag';
import { AddressString } from 'utils';

import { GetSmartContractCallsByAddress } from '../credentials/credentials.graphql';

const getOperationNames = (definitions: DocumentNode['definitions']) =>
  definitions
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

export async function getUsedContractsbyAddress(address: AddressString, protocols: KNOWN_PROTOCOL[]) {
  const response = await graphqlRequest<
    GetSmartContractCallsByAddressQuery,
    GetSmartContractCallsByAddressQueryVariables
  >({
    document: GetSmartContractCallsByAddress,
    variables: {
      address,
      contracts: protocols.map((p) => p.addresses).flat(),
    },
  });

  const usedContractAddresses = response.ethereum?.smartContractCalls?.map(
    (call) => call.smartContract?.address.address?.toString()
  );

  return protocols.filter((p) => p.addresses.some((addr) => usedContractAddresses?.includes(addr)));
}
