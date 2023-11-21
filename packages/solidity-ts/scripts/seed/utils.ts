import { join } from 'path';

import { NFTStorage } from 'nft.storage'; // @todo (Martin, before january 2024): check if need to upgrade to v2

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
require('dotenv').config({ path: join(__dirname, '../../.env') });

const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_TOKEN;

if (NFT_STORAGE_TOKEN == null) throw new Error('Missing NFT_STORAGE_TOKEN');

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

export const uploadMetadata = async (json: any): Promise<string> => {
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  const URI = await client.storeBlob(blob);

  console.log('Uploaded metadata to IPFS:', URI);

  return URI;
};
