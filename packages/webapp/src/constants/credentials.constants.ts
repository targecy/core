import { CredentialStatusType, W3CCredential } from '@0xpolygonid/js-sdk';

export const TEST_CREDENTIAL: Partial<W3CCredential> = {
  id: 'TEST_ID',
  type: ['TEST_TYPE'],
  issuer: 'TEST_ISSUER',
  issuanceDate: new Date().toString(),
  expirationDate: new Date().toString(),
  credentialSubject: {
    id: 'TEST_ID',
  },
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  credentialSchema: {
    id: 'TEST_ID',
    type: 'TEST_TYPE',
  },
  credentialStatus: {
    id: 'TEST_ID',
    type: CredentialStatusType.Iden3commRevocationStatusV1,
  },
  merklize: (opts: any) => {
    const ret: any = '';
    return ret;
  },
  getCoreClaimFromProof: (opts: any) => {
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
