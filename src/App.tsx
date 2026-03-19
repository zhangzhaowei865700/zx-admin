import { Suspense, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { Guard } from './routes/Guard'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { VersionUpdateBar } from './components/common/VersionUpdateBar'
import { PageSkeleton } from './components/common/PageSkeleton'
import { routes } from './routes/routes'
import { useAppStore } from './stores'

function App() {
  const element = useRoutes(routes)

  // 监听其他标签页对 app-settings 的修改，自动同步 store（含 i18n/dayjs，由 onRehydrateStorage 处理）
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'app-settings') {
        useAppStore.persist.rehydrate()
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

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
