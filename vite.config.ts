import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'node:path'

const r = (p: string) => path.resolve(import.meta.dirname, p)

// GitHub Pages serves the site from /aharon-cohen/. 404.html at the root is what Pages shows for any missing path.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/aharon-cohen/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': r('src') } },
  build: {
    rollupOptions: {
      input: {
        main: r('index.html'),
        notFound: r('404.html'),
        accessibility: r('accessibility/index.html'),
        privacy: r('privacy/index.html'),
        terms: r('terms/index.html'),
      },
    },
  },
}))
