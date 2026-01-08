import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/finance/api/policies': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/finance/api/processing': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/finance/api/cashflow': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/finance/v3/api-docs': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
})
