import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5280,
    strictPort: false,
    proxy: {
      '/api': { target: 'http://127.0.0.1:3040', changeOrigin: true },
      '/uploads': { target: 'http://127.0.0.1:3040', changeOrigin: true },
    },
  },
  preview: {
    port: 5281,
    strictPort: false,
  },
})
