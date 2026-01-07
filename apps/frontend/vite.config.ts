import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  base: './',
  server: {
    fs: {
      strict: false,
      allow: ['..'],
    },
  },
  resolve: {
    alias: [
      { find: '@tma/shared', replacement: path.resolve(__dirname, '../../packages/shared/src/index.ts') },
      { find: /^@\/(.*)/, replacement: path.resolve(__dirname, '$1') },
    ],
  },
});