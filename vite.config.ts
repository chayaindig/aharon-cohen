import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'node:path'

// GitHub Pages serves the site from /aharon-cohen/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/aharon-cohen/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
}))
