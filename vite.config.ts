import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  server: {
    // host: true, // Listen on all network interfaces (0.0.0.0)
    port: 3000,
  },
  logLevel: 'info', // Enable detailed logging
}))
