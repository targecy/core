/**
 * Schemas are built using https://schema-builder.polygonid.me/builder
 */

export type SCHEMA = {
  title: string;
  description: string;
  type: string;
  bigint: number;
  hash: string;
  schemaUrl: string;
  jsonLdContextUrl: string;
  credentialSubject: { [key: string]: string | number | boolean | object } & { id: string };
};

export enum SCHEMA_TYPES {
  ProtocolUsedTargecySchema = 'ProtocolUsedTargecySchema',
}

export type SCHEMA_TYPE = keyof typeof SCHEMA_TYPES;

export const SCHEMAS: Record<SCHEMA_TYPE, SCHEMA> = {
  ProtocolUsedTargecySchema: {
    title: 'Protocol Used Credential',
    description: 'The detailed protocol was used by the credential subject.',
    type: 'ProtocolUsedTargecySchema',
    bigint: 202261951100832818588729832059011121523,
    hash: '73c1fc83650a6ba9ce6b0d651d3c2a98',
    schemaUrl: 'ipfs://QmX8WE9aeWafBN6YaQatvraciZGY8PAzPKxtpcVniEZVVX',
    jsonLdContextUrl: 'ipfs://QmSqA4oLY93Rsn2RmKw3dwJPKijWkNrmeKyQSebFwEBou9',
    credentialSubject: {
      id: '',
      // @todo: force these fields when using the schema using TS
      protocol: '',
      a: '',
    },
  },
};
