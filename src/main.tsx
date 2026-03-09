import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { ThemeProvider } from './components/layout/ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './locales'
import './index.css'
import { setupProdMockServer } from '../mock/mockProdServer'

if (import.meta.env.MODE === 'demo') {
  setupProdMockServer()
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// demo 模式使用 HashRouter 避免 GitHub Pages 刷新 404
// 其他环境使用 BrowserRouter 获得更好的 URL
const Router = import.meta.env.MODE === 'demo' ? HashRouter : BrowserRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router basename={import.meta.env.MODE === 'demo' ? undefined : import.meta.env.VITE_BASE_PATH}>
          <App />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
