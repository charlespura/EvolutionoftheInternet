import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/EvolutionoftheInternet/',
  optimizeDeps: {
    include: ['three'],
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
})