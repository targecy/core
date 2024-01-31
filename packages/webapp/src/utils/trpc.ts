import { getBackendUrl } from '@targecy/sdk';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

import type { AppRouter as backendAppRouter } from '../../../backend/src/trpc/router/index';

import { env } from '~/env.mjs';

const localStorageCacheKey = (path: string, input: any) => `trpc-${path}-${JSON.stringify(input)}`;

type CachedItemType = {
  data: any;
  timestamp: number;
};

// @dev You can set specific expiration times for specific paths here.
const getExpirationTimeByPath = (path: string) => {
  if (path.includes('schemas.getAllSchemas')) {
    return 1000 * 60 * 60 * 24; // 24 hours
  } else {
    return 1000 * 60; // 1 minute
  }
};

export const backendTrpcClient = createTRPCProxyClient<backendAppRouter>({
  links: [
    httpBatchLink({
      url: getBackendUrl(env.NEXT_PUBLIC_VERCEL_ENV),
      fetch(url, options) {
        const input = options?.body;
        const path = url.toString();
        const cacheKey = localStorageCacheKey(path, input);
        const cachedResponse = localStorage.getItem(cacheKey);

        try {
          const parsedCached: CachedItemType | undefined = cachedResponse ? JSON.parse(cachedResponse) : undefined;
          if (!parsedCached) throw new Error('No cached response found');
          if (parsedCached.timestamp + getExpirationTimeByPath(path) < Date.now())
            throw new Error('Cached response expired');

          const response = new Response(new Blob([JSON.stringify(parsedCached.data)], { type: 'application/json' }), {
            status: 200, // You can set other response properties as needed
          });
          return Promise.resolve(response);
        } catch (e) {
          // If no cached response, proceed to fetch from server
          return fetch(url, options).then((res) => {
            res
              .clone()
              .json()
              .then((data) => {
                const toCache: CachedItemType = {
                  data: data,
                  timestamp: Date.now(),
                };
                console.log('Caching response for ' + path);
                localStorage.setItem(cacheKey, JSON.stringify(toCache));
              })
              .catch((e) => {
                console.error(e);
              });

            return res;
          });
        }
      },
    }),
  ],
  transformer: superjson as any,
});
