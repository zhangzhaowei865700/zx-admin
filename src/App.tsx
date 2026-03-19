import { Suspense, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { Guard } from './routes/Guard'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { VersionUpdateBar } from './components/common/VersionUpdateBar'
import { PageSkeleton } from './components/common/PageSkeleton'
import { routes } from './routes/routes'
import { useAppStore } from './stores'
import i18n from './locales'
import dayjs from 'dayjs'

const dayjsLocaleMap: Record<string, string> = {
  'zh-CN': 'zh-cn',
  'en-US': 'en',
  'ja-JP': 'ja',
}

function App() {
  const element = useRoutes(routes)

  // 监听其他标签页对 app-settings 的修改，自动同步 store
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'app-settings' && e.newValue) {
        useAppStore.persist.rehydrate()
        // rehydrate 只恢复 store，i18n 和 dayjs 需要手动同步
        try {
          const parsed = JSON.parse(e.newValue)
          const locale = parsed?.state?.locale
          if (locale && locale !== i18n.language) {
            i18n.changeLanguage(locale)
            dayjs.locale(dayjsLocaleMap[locale] ?? 'zh-cn')
          }
        } catch {}
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
