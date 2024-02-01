import { publicProcedure, router } from '..';

import { credentialsRouter } from './credentials.router';
import { reachRouter } from './reach.router';
import { schemasRouter } from './schemas.router';
import { targetsRouter } from './targets.router';
import { usersRouter } from './users.router';

export const appRouter = router({
  ping: publicProcedure.query(() => {
    return 'pong';
  }),
  credentials: credentialsRouter,
  schemas: schemasRouter,
  targets: targetsRouter,
  reach: reachRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
