import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.catchmail.io',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
