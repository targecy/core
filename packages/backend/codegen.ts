/* eslint-disable import/no-extraneous-dependencies */

import { join } from 'path';

import { CodegenConfig } from '@graphql-codegen/cli';

require('dotenv').config({ path: join(__dirname, '.env') });

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    [`src/generated/bitquery.types.ts`]: {
      schema: {
        ['https://graphql.bitquery.io' ?? '']: {
          headers: {
            'content-type': 'application/json',
            'X-API-KEY': process.env.BITQUERY_API_KEY || '',
          },
        },
      },
      documents: [`src/**/*.bitquery.graphql.ts`],
      plugins: ['typescript', 'typescript-operations'],
      config: {
        enumsAsTypes: true,
      },
    },
    [`src/generated/targecy.types.ts`]: {
      schema: {
        [process.env.SUBGRAPH_URL ?? '']: {
          headers: {
            'content-type': 'application/json',
          },
        },
      },
      documents: [`src/**/*.targecy.graphql.ts`],
      plugins: ['typescript', 'typescript-operations'],
      config: {
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
