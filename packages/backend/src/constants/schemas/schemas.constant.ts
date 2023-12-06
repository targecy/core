/**
 * Schemas are built using https://schema-builder.polygonid.me/builder
 */

export type SCHEMA = {
  title: string;
  description: string;
  type: SCHEMA_TYPE;
  bigint: string;
  hash: string;
  schemaUrl: string;
  jsonLdContextUrl: string;
  credentialSubject: { [key: string]: string | number | boolean | object } & { id: string }; // @todo: force these fields when using the schema using TS
};

export enum SCHEMA_TYPES {
  ProtocolUsedTargecySchema = 'ProtocolUsedTargecySchema',
  TokenHolderTargecySchema = 'TokenHolderTargecySchema',
  ActiveOnChainTargecySchema = 'ActiveOnChainTargecySchema',
}

export type SCHEMA_TYPE = keyof typeof SCHEMA_TYPES;

export const isSchemaType = (type: string): type is SCHEMA_TYPE => type in SCHEMA_TYPES;

export const SCHEMAS: Record<SCHEMA_TYPE, SCHEMA> = {
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
};
