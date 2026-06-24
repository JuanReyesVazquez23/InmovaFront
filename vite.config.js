import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // Dev only: proxy /api to local Flask
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: { vendor: ['react', 'react-dom'] },
        },
      },
    },
    // Make VITE_API_URL available — critical for production Railway deploy
    define: {
      '__API_URL__': JSON.stringify(env.VITE_API_URL || ''),
    },
  }
})
