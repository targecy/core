import { router } from '..';

import { credentialsRouter } from './credentials.router';
import { schemasRouter } from './schemas.router';
import { targetsRouter } from './targets.router';

export const appRouter = router({
  credentials: credentialsRouter,
  schemas: schemasRouter,
  targets: targetsRouter,
});

export type AppRouter = typeof appRouter;
