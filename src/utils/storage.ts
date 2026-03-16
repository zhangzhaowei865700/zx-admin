const USER_INFO_KEY = 'admin_user_info'
const USER_STORAGE_KEY = 'user-storage'

export function getUserInfo<T = Record<string, unknown>>(): T | null {
  const userInfo = localStorage.getItem(USER_INFO_KEY)
  if (!userInfo) return null
  try {
    return JSON.parse(userInfo) as T
  } catch {
    console.error('[storage] Failed to parse user info from localStorage')
    return null
  }
}

export function setUserInfo<T>(info: T): void {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(info))
}

export function removeUserInfo(): void {
  localStorage.removeItem(USER_INFO_KEY)
}

/**
 * 直接从 localStorage 读取 token（不依赖 Zustand 内存状态）
 * 用于请求拦截器，确保 localStorage 被清空后立即失效
 */
export function getToken(): string | null {
  const userStorage = localStorage.getItem(USER_STORAGE_KEY)
  if (!userStorage) return null
  try {
    const parsed = JSON.parse(userStorage)
    return parsed?.state?.token || null
  } catch {
    console.error('[storage] Failed to parse user storage from localStorage')
    return null
  }
}
