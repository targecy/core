import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import superjson from 'superjson';

import { prisma } from '../db';

/**
 * Creates a context without req/res, useful for testing
 */
export const createBaseContext = () => ({
  prisma,
});

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  const baseContext = createBaseContext();

  return {
    ...baseContext,
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const middleware = t.middleware;
export const router = t.router;

const logger = t.middleware(async ({ path, type, rawInput, next }) => {
  const result = await next();

  if (result.ok) {
    console.info(`Ok: ${JSON.stringify({ path, type })}`);
  } else {
    console.error(`Error`, { path, rawInput, type, error: result.error });
  }

  return result;
});

export const publicProcedure = t.procedure.use(logger);
