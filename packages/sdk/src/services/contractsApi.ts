import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { createApi } from '@reduxjs/toolkit/query/react';
import { GraphQLClient } from 'graphql-request';
import { HYDRATE } from 'next-redux-wrapper';
import { environment } from '../utils/context';
import { getEnvironmentFromState } from '../utils/environent.state';

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

export const graphqlBaseQuery = (): BaseQueryFn => async (args) => {
  console.log('graphqlBaseQuery args:', args);
  const { document, variables } = args;

  const env = 'development';

  // @todo @martin: URGENT, select correct environment.

  // const env = getEnvironmentFromState(api.getState()) ?? 'development';

  // console.log('state', api.getState());
  console.log('env', env);

  const baseUrl = getGraphQLUrl(env);

  const graphQLClient = new GraphQLClient(baseUrl, {});

  const result = await graphQLClient.request(document, variables);

  return { data: result };
};

export const api = createApi({
  baseQuery: graphqlBaseQuery(), // @todo (Martin): Check
  reducerPath: baseApiReducerPath,
  tagTypes: baseApiTagTypes,
  endpoints: (build) => ({}),
});

export const {  } = api;
