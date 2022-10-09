import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // '/api': 'http://192.168.1.96:8000',
      '/api': 'http://localhost:8000',
    },
  },
  plugins: [react()],
})
