import request from '@/api/request'
import type { Platform } from '@/types'

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
  userInfo: {
    id: number
    username: string
    nickname: string
    avatar?: string
  }
}

// 第一阶段：账号密码登录，获取临时 token 和平台列表
export const preLogin = (data: LoginParams) =>
  request<PreLoginResult>({
    url: '/api/admin/auth/pre-login',
    method: 'POST',
    data,
  })

// 第二阶段：选择平台，获取正式 token
export const loginPlatform = (data: { tempToken: string; platformId: number }) =>
  request<LoginResult>({
    url: '/api/admin/auth/login-platform',
    method: 'POST',
    data,
  })

export const logout = () =>
  request({
    url: '/api/admin/auth/logout',
    method: 'POST',
  })

export const getUserInfo = () =>
  request<LoginResult['userInfo']>({
    url: '/api/admin/auth/info',
    method: 'GET',
  })

// 已登录状态下获取可切换的平台列表
export const getPlatforms = () =>
  request<Platform[]>({
    url: '/api/admin/auth/platforms',
    method: 'GET',
  })

// 已登录状态下切换平台（用正式 token 换取新平台的 token）
export const switchPlatform = (data: { platformId: number }) =>
  request<LoginResult>({
    url: '/api/admin/auth/switch-platform',
    method: 'POST',
    data,
  })
