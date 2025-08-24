import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split node_modules into separate chunks
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          
          // Split services into their own chunks
          if (id.includes('/services/')) {
            return 'services'
          }
          
          // Split components into their own chunks
          if (id.includes('/components/')) {
            return 'components'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    sourcemap: false // Disable sourcemaps for production
  }
})
