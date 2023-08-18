export const nodeEnv = process.env.NODE_ENV;
export const isNodeDevelopment = nodeEnv === 'development';
export const isNodeProduction = nodeEnv === 'production';
export const isNodeTest = nodeEnv === 'test';

export const vercelEnv = process.env.VERCEL_ENV;
export const isVercelPreview = vercelEnv === 'preview';
export const isVercelProduction = vercelEnv === 'production';
export const isVercelDevelopment = vercelEnv === 'development';
