import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { viteMockServe } from 'vite-plugin-mock'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // demo 模式部署到 GitHub Pages 根路径
    base: env.VITE_BASE_PATH || '/',
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
  }
})
