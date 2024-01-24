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
        [`${process.env.NEXT_PUBLIC_TARGECY_SUBGRAPH_URL}/${process.env.NEXT_PUBLIC_TARGECY_SUBGRAPH_VERSION}`]: {
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
            importBaseApiFrom: '~/services/baseApi',
            exportHooks: true,
            overrideExisting: true,
          },
        },
      ],
    },
  },
};

export default config;
