import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
import localhostConfig from './generated/config/localhost.json' assert { type: 'json' };
import mumbaiConfig from './generated/config/mumbai.json' assert { type: 'json' };
import maticConfig from './generated/config/matic.json' assert { type: 'json' };
import { hostname } from './config/hostname.mjs';

const versionByEnv = (env) => {
  switch (env) {
    case 'preview':
      return '1.3.1';
    case 'development':
      return 'targecy';
    default:
      return undefined;
  }
};

const deployedAddressByEnv = (env) => {
  switch (env) {
    case 'development':
      if (!hostname)
        throw new Error(
          'Hostname not found. Please check hostname.mjs file. You can set it up by running "yarn generate:config:hostname"'
        );
      return localhostConfig[hostname];
    case 'preview':
      return mumbaiConfig.address;
    case 'production':
      return maticConfig.address;
    default:
      throw new Error(`Unknown env ${env}`);
  }
};

export const env = createEnv({
  server: {
    CIRCUITS_PATH: z.string().min(1),
    NFT_STORAGE_TOKEN: z.string().min(1),
    RPC_URL: z.string().url(),
    PRIVATE_KEY: z.string().min(1),
    NODE_ENV: z.string().min(1),
    VERCEL_ENV: z.string().min(1).default('development'),
    VERCEL_URL: z.string().url().optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(10),
  },
  client: {
    // Template: TODO REVIEW
    NEXT_PUBLIC_RPC_MAINNET: z.string().url(),
    NEXT_PUBLIC_RPC_MAINNET_INFURA: z.string().url(),
    NEXT_PUBLIC_KEY_INFURA: z.string().min(1),
    NEXT_PUBLIC_KEY_ETHERSCAN: z.string().min(1),
    NEXT_PUBLIC_KEY_BLOCKNATIVE_DAPPID: z.string().min(1),
    NEXT_PUBLIC_FAUCET_ALLOWED: z.boolean(),
    NEXT_PUBLIC_BURNER_FALLBACK_ALLOWED: z.boolean(),
    NEXT_PUBLIC_CONNECT_TO_BURNER_AUTOMATICALLY: z.boolean(),
    NEXT_PUBLIC_VERCEL_ENV: z
      .union([z.literal('production'), z.literal('preview'), z.literal('development')])
      .default('development'),

    // Custom
    NEXT_PUBLIC_TARGECY_SUBGRAPH_URL: z.string().url(),
    NEXT_PUBLIC_TARGECY_CONTRACT_ADDRESS: z
      .string()
      .min(1)
      .describe(
        'Targency contract address. If working locally, you can use localhost config and hostname properly load on hostname.ts file.'
      ),
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: z.string().min(1).default('localhost'),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // runtimeEnv: {
  //   DATABASE_URL: process.env.DATABASE_URL,
  //   OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  runtimeEnv: {
    NEXT_PUBLIC_RPC_MAINNET: process.env.NEXT_PUBLIC_RPC_MAINNET,
    NEXT_PUBLIC_RPC_MAINNET_INFURA: process.env.NEXT_PUBLIC_RPC_MAINNET_INFURA,
    NEXT_PUBLIC_KEY_INFURA: process.env.NEXT_PUBLIC_KEY_INFURA,
    NEXT_PUBLIC_KEY_ETHERSCAN: process.env.NEXT_PUBLIC_KEY_ETHERSCAN,
    NEXT_PUBLIC_KEY_BLOCKNATIVE_DAPPID: process.env.NEXT_PUBLIC_KEY_BLOCKNATIVE_DAPPID,
    NEXT_PUBLIC_FAUCET_ALLOWED: Boolean(process.env.NEXT_PUBLIC_FAUCET_ALLOWED),
    NEXT_PUBLIC_BURNER_FALLBACK_ALLOWED: Boolean(process.env.NEXT_PUBLIC_BURNER_FALLBACK_ALLOWED),
    NEXT_PUBLIC_CONNECT_TO_BURNER_AUTOMATICALLY: Boolean(process.env.NEXT_PUBLIC_CONNECT_TO_BURNER_AUTOMATICALLY),
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

    // Custom
    NEXT_PUBLIC_TARGECY_SUBGRAPH_URL: `${process.env.NEXT_PUBLIC_TARGECY_SUBGRAPH_URL}/${
      versionByEnv(process.env.NEXT_PUBLIC_VERCEL_ENV) ?? process.env.NEXT_PUBLIC_TARGECY_SUBGRAPH_VERSION
    }`,
    NEXT_PUBLIC_TARGECY_CONTRACT_ADDRESS: deployedAddressByEnv(process.env.NEXT_PUBLIC_VERCEL_ENV || 'development'),

    CIRCUITS_PATH: process.env.CIRCUITS_PATH,
    NFT_STORAGE_TOKEN: process.env.NFT_STORAGE_TOKEN,
    RPC_URL: process.env.RPC_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
});
