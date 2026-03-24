import { useState, useCallback } from 'react'
import { usePolling } from './usePolling'

const CHECK_INTERVAL = 5 * 60 * 1000 // 5 分钟

export function useVersionCheck() {
  const [hasNewVersion, setHasNewVersion] = useState(false)

  const checkVersion = useCallback(async () => {
    if (import.meta.env.DEV) return // dev 模式无 version.json，跳过
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, '')
      const res = await fetch(`${base}/version.json?t=${Date.now()}`)
      if (!res.ok) return
      const { version } = await res.json()
      if (version && version !== __APP_VERSION__) {
        setHasNewVersion(true)
      }
    } catch {
      // 开发环境或网络异常时忽略
    }
  }, [])

  usePolling(checkVersion, {
    interval: CHECK_INTERVAL,
    immediate: true,
    visibilityAware: true,
  })

  const refresh = useCallback(() => {
    window.location.reload()
  }, [])

  return { hasNewVersion, refresh }
}
