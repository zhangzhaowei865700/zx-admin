export type { PageParams, PageResult, ApiResponse, User, Tenant } from './index'

// 登录请求
export interface LoginParams {
  username: string
  password: string
}

// 登录响应
export interface LoginResult {
  token: string
  user: import('./index').User
}
