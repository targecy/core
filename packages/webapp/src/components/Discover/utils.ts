import { z } from 'zod';

import { Benefit } from './benefits.constants';

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

export async function fetchAndParseSheetData<T>(url: string, mapper: (obj: any) => T | undefined): Promise<T[]> {
  try {
    const response = await fetch(url);
    const csvData = await response.text();
    console.log('csv', csvData);
    const jsonData = csvToJson<T>(csvData, mapper);
    console.log('json', jsonData);
    return jsonData;
  } catch (error) {
    console.error('Error fetching or parsing Google Sheet data:', error);
    return [];
  }
}

export function csvToJson<T>(csv: string, mapper: (obj: any) => T | undefined): T[] {
  const lines = csv.split('\n').filter((line) => line.trim()); // Filter out empty lines
  const result: T[] = [];
  const headers = lines[0].replace('"', '').replace('\r', '').replace('\n', '').split(',');

  for (let i = 1; i < lines.length; i++) {
    const obj: Record<string, string> = {};
    const currentline = lines[i].split(',');

    console.log(headers);
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    // Use the mapper function to transform and map the object to the generic type T
    const mapped = mapper(obj);
    if (mapped) result.push(mapped);
  }

  return result;
}

export function mapToBenefit(obj: Record<string, string>): Benefit | undefined {
  console.log(obj);
  if (!obj.protocol || !obj.chain || !obj.icon || !obj.offer || !obj.link) return undefined;
  return {
    protocol: obj.protocol,
    chain: obj.chain,
    icon: obj.icon?.replace('"', ''),
    offer: obj.offer,
    link: obj.link?.replace('"', ''),
  };
}
