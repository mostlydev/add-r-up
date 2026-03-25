import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'www',
  build: {
    outDir: 'www',
    emptyOutDir: false,
  },
})
