import { router } from '..';

import { txsRouter } from './txsRouter';

export const appRouter = router({
  txs: txsRouter,
});

export type AppRouter = typeof appRouter;
