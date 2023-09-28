import { defineConfig } from 'tsup';

const tsupConfig = defineConfig({
  entry: ['trpc-api-export/builder/index.ts'],
  outDir: 'trpc-api-export/dist',
  format: ['cjs'],
  clean: true,
  dts: true,
  tsconfig: 'trpc-api-export/builder/tsconfig.tsup.json',
});

// eslint-disable-next-line
export default tsupConfig;
