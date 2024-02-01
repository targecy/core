/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { z } from 'zod';

const envVariables = z.object({
  NODE_ENV: z.union([z.literal('development'), z.literal('staging'), z.literal('production')]),
  PORT: z.string().optional(),
  PRIVATE_KEY: z.string().startsWith('0x'),
  CONTRACT_ADDRESS: z.string().startsWith('0x'),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
