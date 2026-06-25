import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { injectPageMetaPlugin } from './src/seo/vite-plugin-inject-page-meta'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectPageMetaPlugin()],
  server: {
    host: true, // Expose to network
    proxy: {
      // Forward /api to Django backend (run backend with: python manage.py runserver)
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
