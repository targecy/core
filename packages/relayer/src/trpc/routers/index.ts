import SuperJSON from 'superjson';
import { router, publicProcedure } from '..';

import { txsRouter } from './txs.router';

export const appRouter = router({
  ping: publicProcedure.query(() => {
    return 'pong';
  }),
  txs: txsRouter,
});

export type AppRouter = typeof appRouter;
