import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In development, /api requests go to Express instead of the Vite server.
      '/api': 'http://localhost:5000'
    }
  }
});

