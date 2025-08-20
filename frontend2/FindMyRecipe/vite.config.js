// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This rule says: any request starting with "/api"
      // will be forwarded to your real backend.
      '/api': {
        target: 'https://find-my-recipe-backend.web.app',
        changeOrigin: true,
        secure: false,
        // This line removes the '/api' prefix when forwarding the request,
        // if your backend routes don't include it (e.g., /recipes/9 instead of /api/recipes/9)
        // If your backend routes DO include /api, you can remove the rewrite line.
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})