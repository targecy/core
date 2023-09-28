import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { prisma } from '../db';
import * as trpcExpress from '@trpc/server/adapters/express';

type CreateContextOptions = Record<string, never>;

/**
 * Creates a context without req/res, useful for testing
 */
export const createBaseContext = async () => ({
  prisma,
});

export const createContext = async ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  const baseContext = await createBaseContext();

  return {
    ...baseContext,
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const middleware = t.middleware;
export const router = t.router;

const logger = t.middleware(async ({ path, type, next }) => {
  const result = await next();

  if (result.ok) {
    console.info(`Ok: ${JSON.stringify({ path, type })}`);
  } else {
    console.error(`Error: ${JSON.stringify({ path, type })}`);
  }

  return result;
});

export const publicProcedure = t.procedure.use(logger);

// export const publicProcedure = t.procedure;
