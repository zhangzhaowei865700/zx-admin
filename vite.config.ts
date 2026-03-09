import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { viteMockServe } from 'vite-plugin-mock'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => ({
  // demo 模式部署到 GitHub Pages 时，base 设为仓库名路径
  base: mode === 'demo' ? '/zx-admin/' : '/',
  plugins: [
    react(),
    viteMockServe({
      mockPath: path.resolve(__dirname, './mock'),
      enable: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: process.env.NODE_ENV === 'production'
      ? {
          '/api': {
            target: 'http://localhost:9001',
            changeOrigin: true,
          },
        }
      : undefined,
  },
}))
