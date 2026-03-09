const platformNameMap: Record<number, string> = {
  1: '六合山庄',
  2: '山悦酒店',
  3: '星海民宿',
}

export default [
  // 第一阶段：预登录，返回临时 token + 可选平台列表
  {
    url: '/api/admin/auth/pre-login',
    method: 'POST',
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username, password } = body
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          data: {
            tempToken: 'temp-token-' + Date.now(),
            platforms: [
              {
                id: 1,
                name: '六合山庄',
                code: 'platform',
                description: '六合山庄独立管理后台',
                path: '/',
              },
              {
                id: 2,
                name: '山悦酒店',
                code: 'shanyue',
                description: '山悦酒店独立管理后台',
                path: '/',
              },
              {
                id: 3,
                name: '星海民宿',
                code: 'xinghai',
                description: '星海民宿独立管理后台',
                path: '/',
              },
            ],
          },
          msg: '验证成功',
        }
      }
      return {
        code: 401,
        data: null,
        msg: '用户名或密码错误',
      }
    },
  },
  // 第二阶段：选择平台登录，返回正式 token + 用户信息
  {
    url: '/api/admin/auth/login-platform',
    method: 'POST',
    response: ({ body }: { body: { tempToken: string; platformId: number } }) => {
      const { tempToken, platformId } = body
      if (!tempToken || !tempToken.startsWith('temp-token-')) {
        return {
          code: 401,
          data: null,
          msg: '临时凭证无效或已过期',
        }
      }
      return {
        code: 200,
        data: {
          token: 'token-platform-' + platformId + '-' + Date.now(),
          saasName: platformNameMap[platformId] || '未知平台',
          userInfo: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            avatar: '',
          },
        },
        msg: '登录成功',
      }
    },
  },
  // 登出
  {
    url: '/api/admin/auth/logout',
    method: 'POST',
    response: {
      code: 200,
      data: null,
      msg: '登出成功',
    },
  },
  // 获取用户信息
  {
    url: '/api/admin/auth/info',
    method: 'GET',
    response: {
      code: 200,
      data: {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        avatar: '',
      },
      msg: 'success',
    },
  },
  // 已登录状态获取可切换的平台列表
  {
    url: '/api/admin/auth/platforms',
    method: 'GET',
    response: {
      code: 200,
      data: [
        {
          id: 1,
          name: '六合山庄',
          code: 'platform',
          description: '六合山庄独立管理后台',
          path: '/',
        },
        {
          id: 2,
          name: '山悦酒店',
          code: 'shanyue',
          description: '山悦酒店独立管理后台',
          path: '/',
        },
        {
          id: 3,
          name: '星海民宿',
          code: 'xinghai',
          description: '星海民宿独立管理后台',
          path: '/',
        },
      ],
      msg: 'success',
    },
  },
  // 已登录状态切换平台
  {
    url: '/api/admin/auth/switch-platform',
    method: 'POST',
    response: ({ body }: { body: { platformId: number } }) => {
      const { platformId } = body
      return {
        code: 200,
        data: {
          token: 'token-platform-' + platformId + '-' + Date.now(),
          saasName: platformNameMap[platformId] || '未知平台',
          userInfo: {
            id: 1,
            username: 'admin',
            nickname: '管理员',
            avatar: '',
          },
        },
        msg: '切换成功',
      }
    },
  },
]
