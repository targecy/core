import { router } from '..';

import { credentialsRouter } from './credentials.router';
import { schemasRouter } from './schemas.router';
import { targetsRouter } from './targets.router';
import { usersRouter } from './users.router';
import { zkpRequestRouter } from './zkpRequest.router';

export const appRouter = router({
  credentials: credentialsRouter,
  schemas: schemasRouter,
  targets: targetsRouter,
  zkpRequest: zkpRequestRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
