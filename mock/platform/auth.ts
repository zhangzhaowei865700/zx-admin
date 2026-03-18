import { users, platforms, computeUserPermissions, hydrateRoleNames, type StoreUser } from './_store'

interface TempSession {
  username: string
  createdAt: number
}

interface AccessSession {
  username: string
  platformId: number
  createdAt: number
}

const LOGIN_CODE = 401
const TEMP_TOKEN_EXPIRE_MS = 5 * 60 * 1000
const ACCESS_TOKEN_EXPIRE_MS = 2 * 60 * 60 * 1000

// 挂载到 globalThis，避免 mock 模块热重载时 session 丢失
const g = globalThis as Record<string, unknown>
const tempSessions: Map<string, TempSession> = (g.__mockTempSessions as Map<string, TempSession>) ?? new Map()
const accessSessions: Map<string, AccessSession> = (g.__mockAccessSessions as Map<string, AccessSession>) ?? new Map()
const tokenRef: { value: string } = (g.__mockTokenRef as { value: string }) ?? { value: '' }
g.__mockTempSessions = tempSessions
g.__mockAccessSessions = accessSessions
g.__mockTokenRef = tokenRef

const buildTempToken = () => `temp-token-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const buildAccessToken = (platformId: number, username: string) => {
  const payload = btoa(`${platformId}:${username}`)
  return `mock-token.${payload}.${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 8)}`
}

/** 尝试从 token 字符串解析出嵌入的 platformId 和 username（用于开发服务器重启后自动恢复 session） */
const parseTokenPayload = (token: string): { platformId: number; username: string } | null => {
  const parts = token.split('.')
  if (parts.length !== 4 || parts[0] !== 'mock-token') return null
  try {
    const [platformId, username] = atob(parts[1]).split(':')
    if (!platformId || !username) return null
    return { platformId: Number(platformId), username }
  } catch {
    return null
  }
}

const buildLoginPayload = (user: StoreUser, platformId: number, token: string) => {
  const platform = platforms.find((p) => p.id === platformId)
  return {
    token,
    saasName: platform?.name || 'Unknown Platform',
    permissions: computeUserPermissions(user),
    userInfo: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar, roles: hydrateRoleNames(user.roleIds) },
  }
}

const getAuthorizationToken = (headers?: Record<string, string>) => {
  if (!headers) return ''
  return headers.Authorization || headers.authorization || ''
}

export const getSessionByAuth = (headers?: Record<string, string>) => {
  const headerToken = getAuthorizationToken(headers)

  // 严格验证：必须有 header token 且在 session 中存在
  if (!headerToken) return null

  const session = accessSessions.get(headerToken)
  if (session) {
    if (Date.now() - session.createdAt > ACCESS_TOKEN_EXPIRE_MS) {
      accessSessions.delete(headerToken)
      return null
    }
    return session
  }

  // session 不存在时，尝试从 token 中解析用户信息（开发服务器重启后自动恢复）
  const payload = parseTokenPayload(headerToken)
  if (!payload) return null
  const user = users.find((u) => u.username === payload.username)
  if (!user || !user.platformIds.includes(payload.platformId)) return null

  const restored: AccessSession = { username: payload.username, platformId: payload.platformId, createdAt: Date.now() }
  accessSessions.set(headerToken, restored)
  return restored
}

export const unauthorized = (msg: string) => ({ code: LOGIN_CODE, data: null, msg })

/** 包装 mock response，自动验证 token，未授权时返回 401 */
export const withAuth = <T extends { headers?: Record<string, string> }>(
  fn: (ctx: T) => unknown
) => (ctx: T) => {
  const session = getSessionByAuth(ctx.headers)
  if (!session) return unauthorized('登录已过期')
  return fn(ctx)
}

export default [
  {
    url: '/api/admin/auth/pre-login',
    method: 'POST',
    response: ({ body }: { body: { username?: string; password?: string } }) => {
      const username = body?.username?.trim() || ''
      const password = body?.password || ''
      const user = users.find((u) => u.username === username)

      if (!user || user.password !== password) {
        return unauthorized('用户名或密码错误')
      }
      if (user.status !== 1) {
        return unauthorized('账号已被禁用')
      }

      const tempToken = buildTempToken()
      tempSessions.set(tempToken, { username, createdAt: Date.now() })
      const availablePlatforms = platforms.filter((p) => user.platformIds.includes(p.id))

      return { code: 200, data: { tempToken, platforms: availablePlatforms }, msg: '预登录成功' }
    },
  },
  {
    url: '/api/admin/auth/login-platform',
    method: 'POST',
    response: ({ body }: { body: { tempToken?: string; platformId?: number } }) => {
      const tempToken = body?.tempToken || ''
      const platformId = Number(body?.platformId || 0)
      const session = tempSessions.get(tempToken)

      if (!session) return unauthorized('临时令牌无效或已过期')
      if (Date.now() - session.createdAt > TEMP_TOKEN_EXPIRE_MS) {
        tempSessions.delete(tempToken)
        return unauthorized('临时令牌已过期')
      }

      const user = users.find((u) => u.username === session.username)
      if (!user || !user.platformIds.includes(platformId)) {
        return unauthorized('无权访问该平台')
      }

      tempSessions.delete(tempToken)
      const accessToken = buildAccessToken(platformId, session.username)
      accessSessions.set(accessToken, { username: session.username, platformId, createdAt: Date.now() })
      tokenRef.value = accessToken

      return { code: 200, data: buildLoginPayload(user, platformId, accessToken), msg: '登录成功' }
    },
  },
  {
    url: '/api/admin/auth/logout',
    method: 'POST',
    response: ({ headers }: { headers?: Record<string, string> }) => {
      const token = getAuthorizationToken(headers)
      if (token) accessSessions.delete(token)
      if (!token && tokenRef.value) accessSessions.delete(tokenRef.value)
      if (token === tokenRef.value || !token) tokenRef.value = ''
      return { code: 200, data: null, msg: '登出成功' }
    },
  },
  {
    url: '/api/admin/auth/info',
    method: 'GET',
    response: ({ headers }: { headers?: Record<string, string> }) => {
      const session = getSessionByAuth(headers)
      if (!session) return unauthorized('登录已过期')
      const user = users.find((u) => u.username === session.username)
      if (!user) return unauthorized('用户不存在')
      return {
        code: 200,
        data: {
          id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar,
          roles: hydrateRoleNames(user.roleIds),
          permissions: computeUserPermissions(user),
          platformId: session.platformId,
        },
        msg: 'success',
      }
    },
  },
  {
    url: '/api/admin/auth/platforms',
    method: 'GET',
    response: ({ headers }: { headers?: Record<string, string> }) => {
      const session = getSessionByAuth(headers)
      if (!session) return unauthorized('登录已过期')
      const user = users.find((u) => u.username === session.username)
      if (!user) return unauthorized('用户不存在')
      return { code: 200, data: platforms.filter((p) => user.platformIds.includes(p.id)), msg: 'success' }
    },
  },
  {
    url: '/api/admin/auth/switch-platform',
    method: 'POST',
    response: ({ body, headers }: { body: { platformId?: number }; headers?: Record<string, string> }) => {
      const session = getSessionByAuth(headers)
      if (!session) return unauthorized('Login expired')

      const platformId = Number(body?.platformId || 0)
      const user = users.find((u) => u.username === session.username)
      if (!user || !user.platformIds.includes(platformId)) {
        return unauthorized('无权访问该平台')
      }

      const oldToken = getAuthorizationToken(headers)
      if (oldToken) accessSessions.delete(oldToken)

      const newToken = buildAccessToken(platformId, session.username)
      accessSessions.set(newToken, { username: session.username, platformId, createdAt: Date.now() })
      tokenRef.value = newToken

      return { code: 200, data: buildLoginPayload(user, platformId, newToken), msg: '切换成功' }
    },
  },
]
