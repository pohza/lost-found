import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 🔥 required for Docker
    port: 8080,
    proxy: {
      // Local dev: backend on host. In Docker dev, override with VITE_DEV_PROXY=http://api:3000
      "/api": process.env.VITE_DEV_PROXY ?? "http://127.0.0.1:3000",
      "/uploads": process.env.VITE_DEV_PROXY ?? "http://127.0.0.1:3000",
    },
  },
})