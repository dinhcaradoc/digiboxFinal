import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to your Express server during development
      '/api': {
        target: 'http://localhost:3000', // Your Express server address
        changeOrigin: true,
        secure: false
      }
    }
  }
})
