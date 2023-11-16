import { CredentialStatusType, W3CCredential } from '@0xpolygonid/js-sdk';
import { Issuer, Prisma } from '@prisma/client';

import { getCredentialIdentifier } from '../src/utils/credentials/credentials.utils';

import { credentials } from './data';

export const credentialsData = (issuer: Issuer): Prisma.CredentialCreateManyInput[] =>
  credentials().map((c: W3CCredential) => {
    return {
      did: c.id,
      type: c.type.toLocaleString(),
      identifier: getCredentialIdentifier(c),
      credential: JSON.parse(JSON.stringify(c)),
      issuerDid: issuer.did,
      issuedTo: c.credentialSubject['@id'] as string,
    };
  });

export function getRandomInt(max: number = 10000000000000000, min: number = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const makeCredential = (credentialSubject: any) => {
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
    merklize: () => {
      const ret: any = '';
      return ret;
    },
    getCoreClaimFromProof: () => {
      const ret: any = '';
      return ret;
    },
    getBJJSignature2021Proof: () => {
      const ret: any = '';
      return ret;
    },
    getIden3SparseMerkleTreeProof: () => {
      const ret: any = '';
      return ret;
    },
  };
};
