type AuthEvent = 'logout' | 'switchPlatform'
type AppEvent = 'storeSettingUpdated'

const channel = new BroadcastChannel('auth-channel')

// 广播认证事件到其他标签页
export const broadcastAuthEvent = (event: AuthEvent) => {
  channel.postMessage({ type: event, timestamp: Date.now() })
}

// 监听其他标签页的认证事件
export const onAuthEvent = (callback: (event: AuthEvent) => void) => {
  const handler = (e: MessageEvent<{ type: AuthEvent }>) => {
    callback(e.data.type)
  }
  channel.addEventListener('message', handler)
  return () => channel.removeEventListener('message', handler)
}

const APP_EVENT_KEY = 'app-channel-event'

// 广播应用事件到其他标签页（通过 localStorage storage 事件，跨标签页更可靠）
export const broadcastAppEvent = (event: AppEvent) => {
  localStorage.setItem(APP_EVENT_KEY, JSON.stringify({ type: event, timestamp: Date.now() }))
  // 触发后立即移除，避免下次打开页面时误触发
  setTimeout(() => localStorage.removeItem(APP_EVENT_KEY), 100)
}

// 监听其他标签页的应用事件
export const onAppEvent = (callback: (event: AppEvent) => void) => {
  const handler = (e: StorageEvent) => {
    if (e.key === APP_EVENT_KEY && e.newValue) {
      try {
        const data = JSON.parse(e.newValue) as { type: AppEvent }
        callback(data.type)
      } catch {}
    }
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}
