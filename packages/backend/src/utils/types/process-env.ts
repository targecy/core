/* eslint-disable @typescript-eslint/no-namespace */

import { z } from 'zod';

const envVariables = z.object({
  NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
  PORT: z.string().optional(),
  WALLET_PRIVATE_KEY: z.string().startsWith('0x'),
  CONTRACT_ADDRESS: z.string().startsWith('0x'),
  IDENTITIES_SEED: z.string().min(10),
  POLYGONSCAN_API_KEY: z.string().min(10),
  BITQUERY_URL: z.string().url(),
  BITQUERY_API_KEY: z.string().min(10),
  DATABASE_URL: z.string(),
  SUBGRAPH_URL: z.string().url(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
