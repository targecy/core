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
  credentialSubject: { [key: string]: string | number | boolean | object } & { id: string };
};

export enum SCHEMA_TYPES {
  ProtocolUsedTargecySchema = 'ProtocolUsedTargecySchema',
  TokenHolderTargecySchema = 'TokenHolderTargecySchema',
}

export type SCHEMA_TYPE = keyof typeof SCHEMA_TYPES;

export const isSchemaType = (type: string): type is SCHEMA_TYPE => type in SCHEMA_TYPES;

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

  TokenHolderTargecySchema: {
    title: 'Token Holder Credential',
    description: 'The user holds tokens.',
    type: 'TokenHolderTargecySchema',
    bigint: '208348334151287571258325463885365100839',
    hash: '27c10f03a0c97d2bd6f290adf76dbe9c',
    schemaUrl: 'ipfs://QmQizQKfz7CjkTg9zhwGvEREwH6aKSfLjcK8gJEEQCpcs2',
    jsonLdContextUrl: 'ipfs://QmWZ3D7FLqYqPJKm9fxLyAhciTdAnKVx8nok6T7VvA3LZR',
    credentialSubject: {
      id: '',
      token: '',
      amount: '',
      tokenId: '',
    },
  },
};
