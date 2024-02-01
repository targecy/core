import { resolve } from 'path';
const __dirname = resolve();
import './src/env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { esmExternals: true, externalDir: true, swcFileReading: true },

  // https://github.com/vercel/next.js/issues/36221
  //swcMinify: true,
  productionBrowserSourceMaps: true,
  compiler: {
    emotion: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // -------------------------------------------
      // your aliases
      'eth-hooks': resolve(__dirname, './node_modules/eth-hooks'),
      'eth-components': resolve(__dirname, './node_modules/eth-components'),
      'react-css-theme-switcher': resolve(__dirname, './node_modules/react-css-theme-switcher'),
      react: resolve(__dirname, './node_modules/react'),
      'react-dom': resolve(__dirname, './node_modules/react-dom'),
      // -------------------------------------------
      '@common': resolve(__dirname, '../common/src'),
    };

    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };

    // @todo(kevin) remove after knowing that most of dependencies has the last version of node-gyp-build
    config.module.unknownContextCritical = false;

    return config;
  },
};

export default nextConfig;
