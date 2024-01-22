import { env } from '~/env.mjs';

export const scannerUrl: Record<typeof env.NEXT_PUBLIC_VERCEL_ENV, string> = {
  development: `http://localhost:8090`,
  preview: `https://mumbai.polygonscan.com`,
  production: `https://polygonscan.com`,
};
