/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-default-export */

import { CodegenConfig } from '@graphql-codegen/cli';

import { join } from 'path';

require('dotenv').config({ path: join(__dirname, '.env') });

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    [`src/generated/graphql.types.ts`]: {
      schema: {
        ['http://localhost:8000/subgraphs/name/targecy' ?? '']: {
          // @todo (Martin): Check URL
          headers: {
            'content-type': 'application/json',
          },
        },
      },
      documents: [`src/**/*.graphql.ts`],
      plugins: [
        'typescript',
        'typescript-operations',
        {
          'typescript-rtk-query': {
            importBaseApiFrom: '../services/contractsApi',
            exportHooks: true,
            overrideExisting: true,
          },
        },
      ],
    },
  },
};

export default config;
