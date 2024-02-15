/* eslint-disable import/no-extraneous-dependencies */

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
    [`src/generated/graphql.types.ts`]: {
      schema: {
        [`${process.env.NEXT_PUBLIC_TARGECY_SUBGRAPH_URL}/${
          versionByEnv(process.env.NEXT_PUBLIC_VERCEL_ENV) ?? process.env.NEXT_PUBLIC_TARGECY_SUBGRAPH_VERSION
        }`]: {
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
