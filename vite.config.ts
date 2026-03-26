import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/add-r-up/',
  publicDir: 'www',
  build: {
    outDir: 'docs',
  },
})
