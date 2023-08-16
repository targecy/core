module.exports = {
  client: {
    includes: ['src/**/*.graphql.*'],
    excludes: ['**/__tests__/**/*', 'node_modules', '.next'],
    addTypename: true,
    tagName: 'gql',
    service: {
      name: 'explorer',
      url: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
    },
  },
};
