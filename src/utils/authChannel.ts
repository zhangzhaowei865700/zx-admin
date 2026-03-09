type AuthEvent = 'logout' | 'switchPlatform'

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
