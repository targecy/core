import { appRouter } from '@router';
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderTrpcPanel } from 'trpc-panel';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).send(
    renderTrpcPanel(appRouter as any, {
      url: 'http://localhost:4001/api/trpc',
      transformer: 'superjson',
    })
  );
}
