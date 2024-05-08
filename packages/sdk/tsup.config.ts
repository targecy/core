import { defineConfig } from 'tsup';
import alias from 'esbuild-plugin-alias';
import fixCjsExports from 'tsup-fix-cjs-exports'


export default defineConfig({
  shims: true,
  entry: ['src/index.ts'],
  target: 'esnext',
  format: ['esm', 'cjs'], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: true,
  sourcemap: true,
  clean: true,
  plugins: [fixCjsExports()],
  esbuildPlugins: [
    alias({
      '~': './src',
      '@backend': '../backend/src',
      '@relayer': '../relayer/src',
      '@common': '../common/src',
    }),
  ],
  cjsInterop: true,
  external: ["@0xpolygonid/js-sdk",  "@iden3/js-iden3-core"]
});
