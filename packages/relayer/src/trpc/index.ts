import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import superjson from 'superjson';
import * as trpcExpress from '@trpc/server/adapters/express';
import { PrismaClient } from '@prisma/client';

type CreateContextOptions = Record<string, never>;

/**
 * Creates a context without req/res, useful for testing
 */
export const createBaseContext = () => {
  const prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
    ],
  });

  if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
      console.log('Query: ' + e.query);
      console.log('Params: ' + e.params);
      console.log('Duration: ' + e.duration + 'ms');
    });
  }

  return {
    prisma,
  };
};

export const createContext = async ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
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
  errorFormatter({ shape }) {
    return shape;
  },
});

export const middleware = t.middleware;
export const router = t.router;

const logger = t.middleware(async ({ path, type, rawInput, next }) => {
  const result = await next();

  if (result.ok) {
    console.info(`Ok: ${JSON.stringify({ path })}`);
  } else {
    console.error(`Error`, { path, rawInput, type, error: result.error });
  }

  return result;
});

export const publicProcedure = t.procedure.use(logger);
