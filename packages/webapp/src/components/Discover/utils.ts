import { z } from 'zod';

export const dlnewsSchema = z.array(
  z.object({
    id: z.string(),
    link: z.string(),
    title: z.string(),
    description: z.string(),
    published: z.string(),
  })
);
export type Dlnews = z.infer<typeof dlnewsSchema>;

export const topProtocolsSchema = z.object({
  protocols: z.array(
    z.object({
      category: z.string(),
      name: z.string(),
      logo: z.string(),
      url: z.string(),
      tvl: z.number().nullable(),
      tvlPrevDay: z.number().nullable(),
      mcap: z.number().nullable(),
    })
  ),
});

export type TopProtocols = z.infer<typeof topProtocolsSchema>;

export const protocolPropertiesSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  description: z.string(),
  chain: z.string(),
  logo: z.string(),
  category: z.string(),
  chains: z.array(z.string()),
  twitter: z.string(),
  tvl: z.array(z.object({ date: z.number(), totalLiquidityUSD: z.number() })),
  metrics: z.object({ fees: z.boolean().optional() }).optional(),
  mcap: z.number(),
});

export type ProtocolProperties = z.infer<typeof protocolPropertiesSchema>;

export const tokenPropertiesSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  image: z.string(),
  totalSupply: z.number(),
  tokenStandard: z.string(),
  projectUrl: z.string(),
  twitterUsername: z.string(),
});

export type TokenProperties = z.infer<typeof tokenPropertiesSchema>;
