import type { Platform } from '../index'

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
}

// 第一阶段登录：返回临时 token + 可选平台列表
export interface PreLoginResult {
  tempToken: string
  platforms: Platform[]
}

// 第二阶段登录：选择平台后返回正式 token + 用户信息
export interface LoginResult {
  token: string
  saasName: string
  permissions: string[]
  userInfo: {
    id: number
    username: string
    nickname: string
    avatar?: string
  }
}
