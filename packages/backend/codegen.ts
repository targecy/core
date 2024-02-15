import { join } from 'path';

import { CodegenConfig } from '@graphql-codegen/cli';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: join(__dirname, '.env') });

const versionByEnv = (env: string | undefined) => {
  switch (env) {
    case 'preview':
      return '1.3.1';
    case 'development':
      return 'targecy';
    default:
      return undefined;
  }
};

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    [`src/generated/bitquery.types.ts`]: {
      schema: {
        [process.env.BITQUERY_URL ?? '']: {
          headers: {
            'content-type': 'application/json',
            'X-API-KEY': process.env.BITQUERY_API_KEY || '',
          },
        },
      },
      documents: [`src/**/*.bitquery.graphql.ts`],
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      config: {
        enumsAsTypes: true,
        addUnderscoreToArgsType: true,
        extractAllFieldsToTypes: true,
      },
    },
    [`src/generated/targecy.types.ts`]: {
      schema: {
        [`${process.env.TARGECY_SUBGRAPH_URL}/${
          versionByEnv(process.env.TARGECY_SUBGRAPH_URL) ?? process.env.TARGECY_SUBGRAPH_VERSION
        }`]: {
          headers: {
            'content-type': 'application/json',
          },
        },
      },
      documents: [`src/**/*.targecy.graphql.ts`],
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      config: {
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
