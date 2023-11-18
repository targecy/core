import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { BaseQueryFn, FetchBaseQueryError, FetchBaseQueryMeta, createApi } from '@reduxjs/toolkit/query/react';
import { TRPCClientError } from '@trpc/client';
import { HYDRATE } from 'next-redux-wrapper';
import { relayerTrpcClient } from '../utils/trpc';

const relayerApiTagTypes = [] as const;
const trpcBaseQuery = (): BaseQueryFn => () => ({ data: '' });
const relayerApiReducerPath = 'relayerApi' as const;

const handleTrpcOperationError = (error: any) => {
  if (error instanceof TRPCClientError) {
    console.error('tRPC Error:', error, error.message, error.cause, error.stack);

    return {
      error: {
        data: error.data,
        status: 'CUSTOM_ERROR',
        error: error.message,
      },
    };
  }

  console.error('Error fetching from tRPC:', error);
  const e = error || {};

  return { error: 'message' in e ? e.message : 'Unknown error.' };
};

const trpcOperation = async <Operation extends (...args: any) => any, Input extends Parameters<Operation>[0]>(
  operation: Operation,
  input: Input
): Promise<QueryReturnValue<ReturnType<typeof operation>, FetchBaseQueryError, FetchBaseQueryMeta>> => {
  try {
    const data = await operation(input);

    return { data };
  } catch (error: any) {
    return handleTrpcOperationError(error);
  }
};

export const relayerApi = createApi({
  baseQuery: trpcBaseQuery(),
  reducerPath: relayerApiReducerPath,
  tagTypes: relayerApiTagTypes,
  // eslint-disable-next-line consistent-return
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (build) => ({
    // listTxs: build.query({
    //   queryFn: async (input: Parameters<typeof relayerTrpcClient.txs.list.query>[0]) =>
    //     trpcOperation(relayerTrpcClient.txs.list.query, input),
    // }),
    // deleteTx: build.mutation({
    //   queryFn: async (input: Parameters<typeof relayerTrpcClient.txs.delete.mutate>[0]) =>
    //     trpcOperation(relayerTrpcClient.txs.delete.mutate, input),
    // }),
    // sendTx: build.mutation({
    //   queryFn: async (input: Parameters<typeof relayerTrpcClient.txs.send.mutate>[0]) =>
    //     trpcOperation(relayerTrpcClient.txs.send.mutate, input),
    // }),
  }),
});

export const {} = relayerApi;
