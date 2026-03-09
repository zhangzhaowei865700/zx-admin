import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
