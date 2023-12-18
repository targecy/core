import { router } from '..';

import { credentialsRouter } from './credentials.router';
import { schemasRouter } from './schemas.router';
import { segmentRouter } from './segments.router';
import { targetsRouter } from './targets.router';
import { usersRouter } from './users.router';

export const appRouter = router({
  credentials: credentialsRouter,
  schemas: schemasRouter,
  targets: targetsRouter,
  segment: segmentRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
