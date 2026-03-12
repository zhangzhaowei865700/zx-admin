const USER_INFO_KEY = 'admin_user_info'

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
