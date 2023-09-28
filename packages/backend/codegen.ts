/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-default-export */

import { CodegenConfig } from '@graphql-codegen/cli';

import { join } from 'path';

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
      documents: [`src/**/*.graphql.ts`],
      plugins: ['typescript', 'typescript-operations'],
    },
  },
};

export default config;
