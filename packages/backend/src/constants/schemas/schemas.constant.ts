/**
 * Schemas are built using https://schema-builder.polygonid.me/builder
 */

export type SCHEMA = {
  title: string;
  description: string;
  type: string;
  bigint: string;
  hash: string;
  schemaUrl: string;
  jsonLdContextUrl: string;
  credentialSubject: { [key: string]: string | number | boolean | object } & { id: string };
};

export enum SCHEMA_TYPES {
  ProtocolUsedTargecySchema = 'ProtocolUsedTargecySchema',
  ERC1155TargecySchema = 'ERC1155TargecySchema',
}

export type SCHEMA_TYPE = keyof typeof SCHEMA_TYPES;

export const SCHEMAS: Record<SCHEMA_TYPE, SCHEMA> = {
  ProtocolUsedTargecySchema: {
    title: 'Protocol Used Credential',
    description: 'The detailed protocol was used by the credential subject.',
    type: 'ProtocolUsedTargecySchema',
    bigint: '202261951100832818588729832059011121523',
    hash: '73c1fc83650a6ba9ce6b0d651d3c2a98',
    schemaUrl: 'ipfs://QmX8WE9aeWafBN6YaQatvraciZGY8PAzPKxtpcVniEZVVX',
    jsonLdContextUrl: 'ipfs://QmSqA4oLY93Rsn2RmKw3dwJPKijWkNrmeKyQSebFwEBou9',
    credentialSubject: {
      id: '',
      // @todo: force these fields when using the schema using TS
      protocol: '',
    },
  },

  ERC1155TargecySchema: {
    title: 'ERC1155 Holding Credential',
    description: 'The user holds ERC1155',
    type: 'ERC1155TargecySchema',
    bigint: '206772055814781708517484018426506659211',
    hash: '8b45202538bd3b5f28f6c7fd71d98e9b',
    schemaUrl: 'ipfs://QmQZ9zjX97iKr5ZRBwUfgUnJHdFdVVn66x6tQYEB6eB62R',
    jsonLdContextUrl: 'ipfs://QmQ3GjSRjf3b3bGAWcWA7TeyLVAyqRswELj4ibssM2b881',
    credentialSubject: {
      id: '',
      contractAddress: '',
      tokenId: '',
      amount: '',
    },
  },
};
