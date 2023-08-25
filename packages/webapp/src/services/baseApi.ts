import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import { GraphQLClient } from 'graphql-request';
import { HYDRATE } from 'next-redux-wrapper';

import { env } from '~~/env.mjs';

export const baseApiTagTypes = [] as const;
export const baseApiReducerPath = 'baseApi' as const;
export const GRAPHQL_API_URL = env.NEXT_PUBLIC_SUBGRAPH_URL;

export type Build = EndpointBuilder<
  // eslint-disable-next-line @typescript-eslint/ban-types
  BaseQueryFn<any, unknown, unknown, {}, {}>,
  typeof baseApiTagTypes[number],
  typeof baseApiReducerPath
>;

export const graphqlBaseQuery =
  (
    { baseUrl } = {
      baseUrl: GRAPHQL_API_URL,
    }
  ): BaseQueryFn =>
  async ({ document, variables }) => {
    if (!baseUrl) throw new Error('Missing NEXT_PUBLIC_SUBGRAPH_URL environment variable.');

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
  baseQuery: graphqlBaseQuery(),
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
