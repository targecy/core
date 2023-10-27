import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter as relayerAppRouter } from '@targecy/relayer-api/app.router';
import type { AppRouter as backendAppRouter } from '@targecy/backend-api/app.router';
import superjson from 'superjson';

export const relayerTrpcClient = createTRPCProxyClient<relayerAppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:4000/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          mode: 'cors',
        });
      },
    }),
  ],
  transformer: superjson,
});

export const backendTrpcClient = createTRPCProxyClient<backendAppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:4001/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          mode: 'cors',
        });
      },
    }),
  ],
  transformer: superjson,
});
