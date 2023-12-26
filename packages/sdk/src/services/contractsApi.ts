import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { GraphQLClient } from 'graphql-request';
import { environment } from '../utils/context';
import { GetAllAdsDocument } from '../generated/graphql.types';

export const baseApiTagTypes = [] as const;
export const baseApiReducerPath = 'baseApi' as const;

const getGraphQLUrl = (env: environment) => {
  switch (env) {
    case 'development':
      return 'http://localhost:8000/subgraphs/name/targecy';
    case 'preview':
      return 'https://api.studio.thegraph.com/query/58687/targecy_test/version/latest';
    case 'production':
      throw new Error('Not implemented prod subgraph.');
    default:
      throw new Error('Invalid environment');
  }
};

export const graphqlBaseQuery: BaseQueryFn = async (args, api) => {
  const { document, variables } = args;
  const state:
    | {
        environment: {
          environment: environment;
        };
      }
    | undefined = api.getState() as any;
  const env = state?.environment.environment ?? 'development';

  const baseUrl = getGraphQLUrl(env);

  const graphQLClient = new GraphQLClient(baseUrl, {});

  const result = await graphQLClient.request(document, variables);

  return { data: result };
};

export const api = createApi({
  baseQuery: graphqlBaseQuery,
  reducerPath: baseApiReducerPath,
  tagTypes: baseApiTagTypes,
  endpoints: (build) => ({}),
});

export const {} = api;
