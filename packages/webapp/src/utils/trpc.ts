import { getBackendUrl } from '@targecy/sdk';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

import type { AppRouter as backendAppRouter } from '../../../backend/src/trpc/router/index';

import { env } from '~~/env.mjs';

export const backendTrpcClient = createTRPCProxyClient<backendAppRouter>({
  links: [
    httpBatchLink({
      url: getBackendUrl(env.NEXT_PUBLIC_VERCEL_ENV),
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
