import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { Guard } from './routes/Guard'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { VersionUpdateBar } from './components/common/VersionUpdateBar'
import { PageSkeleton } from './components/common/PageSkeleton'
import { routes } from './routes/routes'

function App() {
  const element = useRoutes(routes)

  return (
    <Guard>
      <ErrorBoundary>
        <VersionUpdateBar />
        <Suspense fallback={<PageSkeleton type="table" />}>
          {element}
        </Suspense>
      </ErrorBoundary>
    </Guard>
  )
}

export default App
