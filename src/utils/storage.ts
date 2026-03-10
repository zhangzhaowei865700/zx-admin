const TOKEN_KEY = 'admin_token'
const USER_INFO_KEY = 'admin_user_info'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

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
