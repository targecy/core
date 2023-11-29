import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import { GraphQLClient } from 'graphql-request';
import { HYDRATE } from 'next-redux-wrapper';
import { environment } from 'src/utils/context';

export const baseApiTagTypes = [] as const;
export const baseApiReducerPath = 'baseApi' as const;

const getGraphQLUrl = (env: environment) => {
  switch (env) {
    case 'development':
      return 'http://localhost:8000/subgraphs/name/targecy';
    case 'preview':
      return 'https://api.studio.thegraph.com/query/58687/targecy_test/version/latest';
    case 'production':
      return 'https://api.studio.thegraph.com/query/58687/targecy_test/version/latest';
    default:
      throw new Error('Invalid environment');
  }
};

export type Build = EndpointBuilder<
  // eslint-disable-next-line @typescript-eslint/ban-types
  BaseQueryFn<any, unknown, unknown, {}, {}>,
  (typeof baseApiTagTypes)[number],
  typeof baseApiReducerPath
>;

export const graphqlBaseQuery =
  (env: environment): BaseQueryFn =>
  async ({ document, variables }) => {
    const baseUrl = getGraphQLUrl(env);

    const graphQLClient = new GraphQLClient(baseUrl, {});

    const result = await graphQLClient.request(document, variables);

    return { data: result };
  };

export const testEndpoint = (build: Build): any =>
  build.query<any, any>({
    queryFn: () => {
      return Promise.resolve({ data: 'test' });
    },
  });

export const api = createApi({
  baseQuery: graphqlBaseQuery('production'), // @todo (Martin): Check
  reducerPath: baseApiReducerPath,
  tagTypes: baseApiTagTypes,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (build) => ({
    test: testEndpoint(build),
  }),
});

export const { useTestQuery } = api;
