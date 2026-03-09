// 全局常量导出

// 路由路径
export const ROUTE_PATH = {
  LOGIN: '/login',
  ROOT: '/',
  DASHBOARD: '/',
  TENANT: '/tenant',
  SYSTEM: '/system',
} as const

// 存储 key
export const STORAGE_KEY = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  THEME: 'theme',
} as const

// 分页默认值
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE_NUM: 1,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const
