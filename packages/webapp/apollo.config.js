import { join } from 'path';

require('dotenv').config({ path: join(__dirname, '.env') });

module.exports = {
  client: {
    includes: ['src/**/*.graphql.*'],
    excludes: ['**/__tests__/**/*', 'node_modules', '.next'],
    addTypename: true,
    tagName: 'gql',
    service: {
      name: 'webapp',
      url: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
    },
  },
};
