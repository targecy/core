module.exports = {
  client: {
    includes: ['src/**/*.graphql.*'],
    excludes: ['**/__tests__/**/*', 'node_modules', '.next'],
    addTypename: true,
    tagName: 'gql',
    service: {
      name: 'webapp',
      url: "http://localhost:8000/subgraphs/name/targecy",
    },
  },
};
