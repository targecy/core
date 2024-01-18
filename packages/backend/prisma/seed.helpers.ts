import { CredentialStatusType } from '@0xpolygonid/js-sdk';

import { PartialCredential } from './types';

export function getRandomInt(max: number = 10000000000000000, min: number = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const makeCredential = (credentialSubject: any): PartialCredential => {
  return {
    id: 'did:' + getRandomInt(),
    type: ['ProtocolUsedTargecySchema'],
    issuer: 'did:1',
    issuanceDate: new Date().toString(), // Expires In one month
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toString(),
    credentialSubject: {
      ...{
        '@id': 'did:' + getRandomInt(),
      },
      ...credentialSubject,
    },
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    credentialSchema: {
      id: 'did:1',
      type: 'ProtocolUsedTargecySchema',
    },
    credentialStatus: {
      id: 'did:1',
      type: CredentialStatusType.Iden3commRevocationStatusV1,
    },
  };
};
