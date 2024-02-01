/**
 * Schemas are built using https://schema-builder.polygonid.me/builder
 */

/**
 * To add a schema, please add:
 * - the SCHEMA_TYPES
 * - the CredentialSubject, and it to CredentialSubjects
 * - the SCHEMA
 */

export type SCHEMA<T extends SCHEMA_TYPE> = {
  title: string;
  description: string;
  type: SCHEMA_TYPE;
  bigint: string;
  hash: string;
  schemaUrl: string;
  jsonLdContextUrl: string;
  credentialSubject: CredentialSubjects[T];
};

export enum SCHEMA_TYPES {
  ProtocolUsedTargecySchema = 'ProtocolUsedTargecySchema',
  TokenHolderTargecySchema = 'TokenHolderTargecySchema',
  ActiveOnChainTargecySchema = 'ActiveOnChainTargecySchema',
  PageViewTargecySchema = 'PageViewTargecySchema',
  CustomEventTargecySchema = 'CustomEventTargecySchema',
}

export type CredentialSubjectBase = { id: string };

export type ProtocolUsedTargecyCredentialSubject = CredentialSubjectBase & {
  protocol: string;
  chain: string;
};

export type TokenHolderTargecyCredentialSubject = CredentialSubjectBase & {
  token: string;
  amount: string;
  tokenId: string;
  chain: string;
};

export type ActiveOnChainTargecyCredentialSubject = CredentialSubjectBase & {
  chain: string;
};

export type PageViewTargecyCredentialSubject = CredentialSubjectBase & {
  path: string;
};

export type CustomEventTargecyCredentialSubject = CredentialSubjectBase & {
  eventId: string;
  eventParam: string;
};

export type CredentialSubjects = {
  ProtocolUsedTargecySchema: ProtocolUsedTargecyCredentialSubject;
  TokenHolderTargecySchema: TokenHolderTargecyCredentialSubject;
  ActiveOnChainTargecySchema: ActiveOnChainTargecyCredentialSubject;
  PageViewTargecySchema: PageViewTargecyCredentialSubject;
  CustomEventTargecySchema: CustomEventTargecyCredentialSubject;
};

export type SCHEMA_TYPE = keyof typeof SCHEMA_TYPES;

export const isSchemaType = (type: string): type is SCHEMA_TYPE => type in SCHEMA_TYPES;

export const SCHEMAS: {
  [K in SCHEMA_TYPE]: SCHEMA<K>;
} = {
  ProtocolUsedTargecySchema: {
    title: 'Protocol Used Credential',
    description: 'The detailed protocol was used by the credential subject.',
    type: 'ProtocolUsedTargecySchema',
    bigint: '308478701700863492110006530473427147480',
    hash: 'd81a4f7ce1feb5b0a6f6a2d73dd612e8',
    schemaUrl: 'ipfs://QmRrZkYQK6YzxapjBNzNck4Yuj6dyEGLkaGpSAcvqhWs1f',
    jsonLdContextUrl: 'ipfs://QmfQZjHYqPMYbFpUzRsJr6SbZT8ScbnQWCWE88haQFHZaw',
    credentialSubject: {
      id: '',
      // @todo: force these fields when using the schema using TS
      protocol: '',
      chain: '',
    },
  },

  TokenHolderTargecySchema: {
    title: 'Token Holder Credential',
    description: 'The user holds tokens.',
    type: 'TokenHolderTargecySchema',
    bigint: '192143328870410829678094971102964264323',
    hash: '83ad14918effde0af646ac8485758d90',
    schemaUrl: 'ipfs://QmVBvJbfeYcMqkdXfzimz7pVJKhy9zAwdonBgoYHKV5ksB',
    jsonLdContextUrl: 'ipfs://QmcvfEeqcHhn5X5XKXZKabJfNCo3Xh5igWU5QBfvGQPQxh',
    credentialSubject: {
      id: '',
      token: '',
      amount: '',
      tokenId: '',
      chain: '',
    },
  },

  ActiveOnChainTargecySchema: {
    title: 'Active On Chain Credential',
    description: 'The user is active on the given chain.',
    type: 'ActiveOnChainTargecySchema',
    bigint: '273073742252225182436056421751409779246',
    hash: '2ea2726f9cab923cb5383715f81670cd',
    schemaUrl: 'ipfs://Qmdd1NN8XLPWdCSskV1AB2cCzc7s2r32gfg7EogNx6cph8',
    jsonLdContextUrl: 'ipfs://QmTrRQMChJgq3EFsXSkwt4RdjxDD3UwrimyJVP1szZeUcu',
    credentialSubject: {
      id: '',
      chain: '',
    },
  },

  PageViewTargecySchema: {
    title: 'Page View Credential',
    description: 'The user saw a page.',
    type: 'PageViewTargecySchema',
    bigint: '210142717432887984386775751639490005048',
    hash: '3888823c5537f3a41b179ecbe403189e',
    schemaUrl: 'ipfs://QmTBcKA3VTRs4NJU2WhFZ9mnijay1o2kCu6Uuoivj2tk9m',
    jsonLdContextUrl: 'ipfs://QmdXwnLaZvnp2sbDZfpCWNNNmaTmgCybLTb7eGvxkHR9QJ',
    credentialSubject: {
      id: '',
      path: '',
    },
  },

  CustomEventTargecySchema: {
    title: 'Custom Event Credential',
    description: 'The user triggered a custom event.',
    type: 'CustomEventTargecySchema',
    bigint: '67381080533818057975946438410012284128',
    hash: 'e0540dc0623ae1e29b8270f4c21fb132',
    schemaUrl: 'ipfs://QmUQfxJgM4GY4GYYFGgoqt13xpRtGrLiACKBn5jG8oxqEV',
    jsonLdContextUrl: 'ipfs://QmWY4rnoBkZGqSqwvGm3vmdFMZvisduNTSnMuNBzbFac3C',
    credentialSubject: {
      id: '',
      eventId: '',
      eventParam: '',
    },
  },
};
