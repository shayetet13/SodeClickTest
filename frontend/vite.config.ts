import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split node_modules into separate chunks
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          
          // Split large modules into separate chunks
          if (id.includes('src/services/')) {
            return 'services';
          }
          
          if (id.includes('src/components/')) {
            return 'components';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    sourcemap: false // Disable sourcemaps in production
  }
})
