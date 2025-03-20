import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: true
  },
  server: {
    port: 3000,
    strictPort: true,
    host: '0.0.0.0',
    cors: true,
    proxy: {
      '/api': {
        target: 'http://backend:3001',
        changeOrigin: true
      }
    }
  },
  root: './',
  build: {
    outDir: 'dist'
  }
});
