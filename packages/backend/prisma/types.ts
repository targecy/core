import { W3CCredential } from '@0xpolygonid/js-sdk';

export type PartialCredential = Pick<
  W3CCredential,
  | 'id'
  | 'type'
  | 'issuer'
  | 'issuanceDate'
  | 'expirationDate'
  | 'credentialSubject'
  | 'credentialSchema'
  | 'credentialStatus'
  | '@context'
>;
