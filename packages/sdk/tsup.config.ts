import { defineConfig } from 'tsup';
import alias from 'esbuild-plugin-alias';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
  esbuildPlugins: [
    alias({
      '~': './src',
      '@backend': '../backend/src',
      '@relayer': '../relayer/src',
      '@common': '../common/src',
    }),
  ],
});
