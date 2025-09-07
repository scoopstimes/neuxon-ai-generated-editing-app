import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    ssr: true,
    outDir: 'dist/server',
    rollupOptions: {
      input: {
        'node-build': resolve(__dirname, 'server/index.ts'),
      },
      output: {
        format: 'es',
        entryFileNames: '[name].mjs',
      },
    },
    target: 'node18',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client'),
      '@shared': resolve(__dirname, './shared'),
    },
  },
});