import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { Spin } from 'antd'
import { Guard } from './routes/Guard'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { routes } from './routes/routes'

function App() {
  const element = useRoutes(routes)

  return (
    <Guard>
      <ErrorBoundary>
        <Suspense fallback={<Spin style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />}>
          {element}
        </Suspense>
      </ErrorBoundary>
    </Guard>
  )
}

export default App
