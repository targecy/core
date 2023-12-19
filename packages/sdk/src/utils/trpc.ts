import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { environment } from './context';

export const relayerTrpcClient: any = (env: environment) =>
  createTRPCProxyClient({
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

export const backendTrpcClient: any = (env: environment) =>
  createTRPCProxyClient({
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
