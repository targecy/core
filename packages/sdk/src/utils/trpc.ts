import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter as relayerAppRouter } from '../../../relayer/src/trpc/router/index';
// import type { AppRouter as backendAppRouter } from '../../../backend/src/trpc/router/index';
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
  transformer: superjson as any,
});
