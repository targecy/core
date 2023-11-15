// import { DocumentNode, OperationDefinitionNode } from 'graphql';
// import { GraphQLClient } from 'graphql-request';
// import parse from 'graphql-tag';

// const getOperationNames = (definitions: DocumentNode['definitions']) =>
//   definitions
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
//     .filter((d): d is OperationDefinitionNode => d.kind === 'OperationDefinition')
//     .map((d) => d?.name?.value)
//     .filter(Boolean)
//     .join(', ');

// export const graphqlRequest = async <RequestResult, Variables>({
//   url,
//   headers,
//   document,
//   variables,
// }: {
//   url: string;
//   headers: Record<string, string>;
//   document: string;
//   variables?: Variables;
//   timeout?: number;
// }): Promise<RequestResult> => {
//   const graphqlClient = new GraphQLClient(url, {
//     headers,
//   });

//   try {
//     console.debug(`Sending graphql request. Operations: ${getOperationNames(parse(document).definitions)}`);
//     const result = await graphqlClient.request<RequestResult, Variables>(document, variables);

//     console.log(result);
//     console.debug(`Ok: graphql request. Operations: ${getOperationNames(parse(document).definitions)}`);

//     return result;
//   } catch (error) {
//     console.log(JSON.stringify(error));
//     // console.error(
//     //   `GraphQL request error, operations: ${getOperationNames(parse(document).definitions)}, error: ${error}`
//     // );

//     throw error;
//   }
// };
