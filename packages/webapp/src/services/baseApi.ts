import { extractFromXml } from '@extractus/feed-extractor';
import { BaseQueryFn, fetchBaseQuery } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import { GraphQLClient } from 'graphql-request';
import { HYDRATE } from 'next-redux-wrapper';

import { env } from '~/env.mjs';
import { Dlnews, TopProtocols, dlnewsSchema, topProtocolsSchema } from '~/pages/discover/utils';

export const baseApiTagTypes = [] as const;
export const baseApiReducerPath = 'baseApi' as const;
export const GRAPHQL_API_URL = env.NEXT_PUBLIC_TARGECY_SUBGRAPH_URL;

export type Build = EndpointBuilder<
  // eslint-disable-next-line @typescript-eslint/ban-types
  BaseQueryFn<any, unknown, unknown, {}, {}>,
  (typeof baseApiTagTypes)[number],
  typeof baseApiReducerPath
>;

export const graphqlBaseQuery =
  (
    { baseUrl } = {
      baseUrl: GRAPHQL_API_URL,
    }
  ): BaseQueryFn =>
  async ({ document, variables }) => {
    if (!baseUrl) throw new Error('Missing NEXT_PUBLIC_TARGECY_SUBGRAPH_URL environment variable.');

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

export const newsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.dlnews.com' }),
  reducerPath: 'newsApi',
  tagTypes: [], // Define your tag types here
  endpoints: (build) => ({
    getNews: build.query<Dlnews, object>({
      query: () => ({
        url: '/arc/outboundfeeds/rss/',
        responseHandler: (response) =>
          response
            .text()
            .then(extractFromXml)
            .then((json) => dlnewsSchema.parse(json.entries))
            .catch(console.error),
      }),
    }),
    // Add other endpoints here
  }),
});

export const defillamaApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://defillama-datasets.llama.fi' }),
  reducerPath: 'defillamaApi',
  tagTypes: [], // Define your tag types here
  endpoints: (build) => ({
    getProtocols: build.query<TopProtocols, object>({
      query: () => ({
        url: '/lite/protocols2',
        responseHandler: (response) => response.json().then(topProtocolsSchema.parse).catch(console.error),
      }),
    }),
  }),
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
  endpoints: (build) => ({}),
});

export const { useGetNewsQuery } = newsApi;
export const { useGetProtocolsQuery } = defillamaApi;
