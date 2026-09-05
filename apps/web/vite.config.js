import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: [
      { find: '@app', replacement: path.resolve(__dirname, 'src/app') },
      { find: '@shell', replacement: path.resolve(__dirname, 'src/shell') },
      { find: '@stores', replacement: path.resolve(__dirname, 'src/stores') },
      { find: '@lib', replacement: path.resolve(__dirname, 'src/lib') },
      { find: '@routes', replacement: path.resolve(__dirname, 'src/routes') },
      { find: /^@modules\/([^/]+)$/, replacement: path.resolve(__dirname, '../../modules/$1/frontend') },
      { find: /^@modules\/([^/]+)\/(.*)$/, replacement: path.resolve(__dirname, '../../modules/$1/frontend/$2') },
      { find: /^@modules\/(.*)$/, replacement: path.resolve(__dirname, '../../modules/$1') }
    ]
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
