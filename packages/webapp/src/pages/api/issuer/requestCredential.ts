// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export type UploadMetadataResponse = {
  uri: string;
};

const inputSchema = z.object({
  credentialSubject: z.record(z.string(), z.string().or(z.number()).or(z.boolean()).or(z.object({}))),
  credentialSchema: z.string(),
  type: z.string(),
  expiration: z.number().optional(),
  revocationOpts: z.object({
    type: z.nativeEnum(CredentialStatusType),
    id: z.string(),
  }),
});

import { CredentialRequest, CredentialStatusType, W3CCredential } from '@0xpolygonid/js-sdk';

import { createIssuerIdentity, initializeStorages, issueCredential } from '~/utils/zk.utils';

export async function requestCredential(credentialRequest: CredentialRequest) {
  const storages = initializeStorages();
  const issuerIdentity = await createIssuerIdentity(storages.identityWallet);
  // Todo Validate Request

  console.log('requesting');
  console.log(storages);

  if (!credentialRequest.credentialSubject.id) throw new Error('Credential Request must have a credentialSubject.id');

  const issued = await issueCredential(storages.identityWallet, issuerIdentity.did, credentialRequest);

  const tree = issued.getIden3SparseMerkleTreeProof();

  console.log(tree);

  await storages.dataStorage.credential.saveCredential(issued);

  console.log('done');

  return issued;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<W3CCredential | any>) => {
  if (req.method !== 'POST') {
    res.status(400).json(new Error('Only POST requests allowed'));
    return;
  }

  let json;
  try {
    const credentialRequest = inputSchema.parse(JSON.parse(req.body));

    const credential = await requestCredential(credentialRequest);

    res.status(200).json(credential);
  } catch (error) {
    console.log(error);
    res.status(400).json(JSON.parse(JSON.stringify(error)));
    return;
  }
};

export default handler;
