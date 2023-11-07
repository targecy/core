/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    externalDir: true,
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    // config.resolve.alias = {
    //   ...config.resolve.alias,
    //   '@trpc-playground/html': path.resolve(packagesDirPath, 'html', 'dist', 'index.js'),
    //   'trpc-playground': path.resolve(packagesDirPath, 'trpc-playground', 'src'),
    // };

    return config;
  },
};
