import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiPort = Number(env.VITE_DEV_API_PORT || env.API_PORT || env.PORT || 3040)
  const devPort = Number(env.VITE_DEV_PORT || 5280)
  const apiTarget = `http://127.0.0.1:${apiPort}`
  const cmsApiUrl = (env.VITE_API_URL || env.NEXT_PUBLIC_CMS_API_URL || '').trim()
  const safeCmsApiUrl =
    mode === 'production' && /localhost|127\.0\.0\.1/i.test(cmsApiUrl) ? '' : cmsApiUrl

  return {
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    plugins: [react(), tailwindcss()],
    define: safeCmsApiUrl
      ? {
          'import.meta.env.VITE_API_URL': JSON.stringify(safeCmsApiUrl.replace(/\/$/, '')),
        }
      : undefined,
    server: {
      host: '127.0.0.1',
      port: devPort,
      strictPort: false,
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/uploads': { target: apiTarget, changeOrigin: true },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: Number(env.VITE_PREVIEW_PORT || 3010),
      strictPort: false,
      allowedHosts: ['digitalmanager.ae','www.digitalmanager.ae', 'n133beijjmpnunnf4xb5faqn.s0226.digitalsofts.com'],
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/uploads': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})
