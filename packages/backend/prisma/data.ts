import { Prisma, Issuer } from '@prisma/client';

import { getCredentialIdentifier } from '../src/utils/credentials/credentials.utils';

import { getRandomInt, makeCredential } from './seed.helpers';
import { PartialCredential } from './types';

export const issuerData: Prisma.IssuerCreateInput = {
  did: 'did:' + getRandomInt(),
  name: 'Targecy Official Issuer',
  profileNonce: 0,
};

export const credentials = () => {
  return [
    makeCredential({
      protocol: 'Compound',
    }),
  ];
};

export const credentialsData = (issuer: Issuer): Prisma.CredentialCreateManyInput[] =>
  credentials().map((c: PartialCredential) => {
    return {
      did: c.id,
      type: c.type.toLocaleString(),
      identifier: getCredentialIdentifier(c),
      credential: JSON.parse(JSON.stringify(c)),
      issuerDid: issuer.did,
      issuedTo: c.credentialSubject['@id'] as string,
    };
  });
