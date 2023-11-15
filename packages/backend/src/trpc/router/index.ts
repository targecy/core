import { router } from '..';

import { credentialsRouter } from './credentials.router';
import { schemasRouter } from './schemas.router';
import { targetsRouter } from './targets.router';
import { zkpRequestRouter } from './zkpRequest.router';

export const appRouter = router({
  credentials: credentialsRouter,
  schemas: schemasRouter,
  targets: targetsRouter,
  zkpRequest: zkpRequestRouter,
});

export type AppRouter = typeof appRouter;
