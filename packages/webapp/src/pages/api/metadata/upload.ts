// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';

import { IncomingForm } from 'formidable';
import { firstValues } from 'formidable/src/helpers/firstValues.js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NFTStorage } from 'nft.storage'; // @todo (Martin, before january 2024): check if need to upgrade to v2

import { getIPFSStorageUrl } from '~common/functions/getIPFSStorageUrl';
import { env } from '~~/env.mjs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export type UploadMetadataResponse = {
  uri: string;
};

type Metadata = any;

// See https://nft.storage/docs/client/js/
const NFT_STORAGE_TOKEN = env.NFT_STORAGE_TOKEN;
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

const handler = async (req: NextApiRequest, res: NextApiResponse<UploadMetadataResponse | Error>) => {
  if (req.method !== 'POST') {
    res.status(400).json(new Error('Only POST requests allowed'));
    return;
  }

  const form = new IncomingForm({
    filter: ({ mimetype }) => !!mimetype && mimetype.includes('image'),
  });

  try {
    const [fields, files] = await form.parse(req);
    const metadata: Metadata = firstValues(form, fields);

    for (const key in files) {
      const fileArray = files[key];
      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0]; // This is an array because HTML allows selecting multiple files in one input. We only allow the user to upload one image.
        const fileData = fs.readFileSync(file.filepath);
        const fileBlob = new Blob([fileData], { type: file.mimetype || undefined }); // The filter option above should ensure that mimetype is defined.
        const fileURI = await client.storeBlob(fileBlob);
        metadata[key] = getIPFSStorageUrl(fileURI);
      }
    }

    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const metadataURI = await client.storeBlob(metadataBlob);

    res.status(200).json({ uri: metadataURI });
  } catch (error: any) {
    res.status(500).json(error);
  }
};

export default handler;
