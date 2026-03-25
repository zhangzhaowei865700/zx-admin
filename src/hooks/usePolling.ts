import { useEffect, useRef, useCallback } from 'react'

export interface UsePollingOptions {
  /** 轮询间隔（毫秒），默认 30000（30 秒） */
  interval?: number
  /** 是否在 mount 时立即执行一次，默认 true */
  immediate?: boolean
  /** 是否感知页面可见性（隐藏时暂停、重新可见时恢复），默认 true */
  visibilityAware?: boolean
}

/**
 * 通用轮询 Hook，支持页面可见性感知
 *
 * - 页面隐藏（切换标签页/最小化）时自动暂停，重新可见时立即补偿一次执行并恢复轮询
 * - 组件卸载时自动清理定时器与事件监听
 * - `fn` 引用变化不会重启轮询（内部使用 ref 持有最新版本）
 *
 * @example
 * ```tsx
 * // 基本用法
 * usePolling(fetchUnreadCount, { interval: 30000 })
 *
 * // 手动控制
 * const { start, stop } = usePolling(syncData, { interval: 10000, immediate: false })
 * <Button onClick={start}>开始同步</Button>
 * <Button onClick={stop}>停止同步</Button>
 * ```
 */
export function usePolling(
  fn: () => void | Promise<void>,
  options: UsePollingOptions = {},
) {
  const { interval = 30000, immediate = true, visibilityAware = true } = options

  const timerRef = useRef<ReturnType<typeof setInterval>>()
  // 始终持有最新 fn，避免 fn 闭包变化时重启轮询
  const fnRef = useRef(fn)
  fnRef.current = fn

  const stop = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearInterval(timerRef.current)
      timerRef.current = undefined
    }
  }, [])

  const start = useCallback(() => {
    stop()
    timerRef.current = setInterval(() => {
      fnRef.current()
    }, interval)
  }, [interval, stop])

  useEffect(() => {
    if (immediate) {
      fnRef.current()
    }
    start()

    // 始终注册监听器，在回调内部判断是否响应，避免 visibilityAware 变化时泄漏
    const handleVisibilityChange = () => {
      if (!visibilityAware) return
      if (document.hidden) {
        stop()
      } else {
        // 页面重新可见：立即补偿一次，再重启定时器
        fnRef.current()
        start()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [immediate, visibilityAware, start, stop])

  return { start, stop }
}
