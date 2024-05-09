import { env } from '~/env.mjs';

export const vercelEnv = env.NEXT_PUBLIC_VERCEL_ENV;
export const isVercelPreview = vercelEnv === 'preview';
export const isVercelProduction = vercelEnv === 'production';
export const isVercelDevelopment = vercelEnv === 'development';

export const providerUrl = 'https://rpc-mumbai.polygon.technology';
export const contractAddress = env.NEXT_PUBLIC_TARGECY_CONTRACT_ADDRESS || '';
