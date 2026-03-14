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

const tempSessions = new Map<string, TempSession>()
const accessSessions = new Map<string, AccessSession>()
let latestAccessToken = ''

const buildTempToken = () => `temp-token-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const buildAccessToken = (platformId: number) =>
  `token-platform-${platformId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

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

const getSessionByAuth = (headers?: Record<string, string>) => {
  const auth = getAuthorizationToken(headers) || latestAccessToken
  if (!auth) return null
  const session = accessSessions.get(auth)
  if (!session) return null
  if (Date.now() - session.createdAt > ACCESS_TOKEN_EXPIRE_MS) {
    accessSessions.delete(auth)
    return null
  }
  return session
}

const unauthorized = (msg: string) => ({ code: LOGIN_CODE, data: null, msg })

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
      const accessToken = buildAccessToken(platformId)
      accessSessions.set(accessToken, { username: session.username, platformId, createdAt: Date.now() })
      latestAccessToken = accessToken

      return { code: 200, data: buildLoginPayload(user, platformId, accessToken), msg: '登录成功' }
    },
  },
  {
    url: '/api/admin/auth/logout',
    method: 'POST',
    response: ({ headers }: { headers?: Record<string, string> }) => {
      const token = getAuthorizationToken(headers)
      if (token) accessSessions.delete(token)
      if (!token && latestAccessToken) accessSessions.delete(latestAccessToken)
      if (token === latestAccessToken || !token) latestAccessToken = ''
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

      const newToken = buildAccessToken(platformId)
      accessSessions.set(newToken, { username: session.username, platformId, createdAt: Date.now() })
      latestAccessToken = newToken

      return { code: 200, data: buildLoginPayload(user, platformId, newToken), msg: '切换成功' }
    },
  },
]
