import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';

import { createContext } from './trpc';
import { appRouter } from './trpc/routers';

const app = express();

app.use(cors());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const PORT = process.env.PORT ?? 4000;

// @todo (Martin): Test DB Connection on startup

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
