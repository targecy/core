import { W3CCredential } from '@0xpolygonid/js-sdk';
import { Prisma } from '@prisma/client';

import { getRandomInt, makeCredential } from './seed.helpers';

export const issuerData: Prisma.IssuerCreateInput = {
  did: 'did:' + getRandomInt(),
  name: 'Targecy Official Issuer',
  profileNonce: 0,
};

export const credentials = (): W3CCredential[] => {
  return [
    makeCredential({
      protocol: 'Compound',
    }),
  ];
};
