// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { NFTStorage } from 'nft.storage';

export type UploadMetadataResponse = {
  uri: string;
};

const inputSchema = z.object({
  json: z.any(),
});
type Input = z.infer<typeof inputSchema>;

// See https://nft.storage/docs/client/js/
const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_TOKEN || '';
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

const handler = async (req: NextApiRequest, res: NextApiResponse<UploadMetadataResponse | Error>) => {
  if (req.method !== 'POST') {
    res.status(400).json(new Error('Only POST requests allowed'));
    return;
  }

  let json;
  try {
    const parsed = inputSchema.parse(JSON.parse(req.body));
    json = parsed.json;
  } catch (error) {
    res.status(400).json(error as any);
    return;
  }

  if (!json) {
    res.status(400).json(new Error('No JSON provided'));
    return;
  }

  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  const URI = await client.storeBlob(blob);

  res.status(200).json({ uri: URI });
};

export default handler;
