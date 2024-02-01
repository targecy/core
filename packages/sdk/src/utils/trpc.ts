import { CreateTRPCProxyClient, createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

import { environment } from './context';
import { appRouter as RelayerAppRouter } from '../generated/types/relayer/routers';
import { appRouter as BackendAppRouter } from '../generated/types/backend/routers';

export const getBackendUrl = (env: environment) => {
  switch (env) {
    case 'development':
      return 'http://localhost:4001/trpc';
    case 'preview':
      return 'https://staging.api.targecy.xyz/trpc';
    case 'production':
      return 'https://api.targecy.xyz/trpc';
    default:
      throw new Error('Invalid environment');
  }
};

export const getRelayerUrl = (env: environment) => {
  switch (env) {
    case 'development':
      return 'http://localhost:4000/trpc';
    case 'preview':
      return 'https://staging.relayer.targecy.xyz/trpc';
    case 'production':
      return 'https://relayer.targecy.xyz/trpc';
    default:
      throw new Error('Invalid environment');
  }
};

export const relayerTrpcClient = (env: environment) =>
  createTRPCProxyClient<typeof RelayerAppRouter>({
    links: [
      httpBatchLink({
        url: getRelayerUrl(env),
        fetch(url, options) {
          return fetch(url, {
            ...options,
            mode: 'cors',
          });
        },
      }),
    ],
    transformer: superjson as any,
  });

export const backendTrpcClient = (env: environment) =>
  createTRPCProxyClient<typeof BackendAppRouter>({
    links: [
      httpBatchLink({
        url: getBackendUrl(env),
        fetch(url, options) {
          return fetch(url, {
            ...options,
            mode: 'cors',
          });
        },
      }),
    ],
    transformer: superjson as any,
  });
