type AuthEvent = 'logout' | 'switchPlatform'
type AppEvent = 'storeSettingUpdated'

const authChannel = new BroadcastChannel('auth-channel')
const appChannel = new BroadcastChannel('app-channel')

// 广播认证事件到其他标签页
export const broadcastAuthEvent = (event: AuthEvent) => {
  authChannel.postMessage({ type: event, timestamp: Date.now() })
}

// 监听其他标签页的认证事件
export const onAuthEvent = (callback: (event: AuthEvent) => void) => {
  const handler = (e: MessageEvent<{ type: AuthEvent }>) => {
    callback(e.data.type)
  }
  authChannel.addEventListener('message', handler)
  return () => authChannel.removeEventListener('message', handler)
}

// 广播应用事件到其他标签页
export const broadcastAppEvent = (event: AppEvent) => {
  appChannel.postMessage({ type: event, timestamp: Date.now() })
}

// 监听其他标签页的应用事件
export const onAppEvent = (callback: (event: AppEvent) => void) => {
  const handler = (e: MessageEvent<{ type: AppEvent }>) => {
    callback(e.data.type)
  }
  appChannel.addEventListener('message', handler)
  return () => appChannel.removeEventListener('message', handler)
}

// 关闭所有 BroadcastChannel，供应用卸载时调用以释放资源
export const closeAuthChannels = () => {
  authChannel.close()
  appChannel.close()
}
