import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

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
    proxy: {
      // 开发环境：生产环境才代理到后端，开发环境走 mock
      '/api': process.env.NODE_ENV === 'production'
        ? {
            target: 'http://localhost:9001',
            changeOrigin: true,
          }
        : false,
    },
  },
}))
