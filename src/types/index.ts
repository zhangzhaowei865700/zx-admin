// 分页参数
export interface PageParams {
  pageNum?: number
  pageSize?: number
}

// 分页结果
export interface PageResult<T> {
  list: T[]
  total: number
}

// API 响应结构
export interface ApiResponse<T = any> {
  code: number
  data: T
  msg: string
}

// 用户类型
export interface User {
  id: number
  username: string
  nickname?: string
  avatar?: string
  phone?: string
  email?: string
  role?: string
  tenantId?: number
  createdAt?: string
  updatedAt?: string
}

// 平台类型
export interface Platform {
  id: number
  name: string
  code: string
  icon?: string
  description?: string
  path: string
}

// 商户类型
export interface Tenant {
  id: number
  name: string
  code: string
  status: number
  contact?: string
  phone?: string
  address?: string
  createdAt?: string
  updatedAt?: string
}

export * from './platform/message'
export * from './platform/dictionary'
export * from './tenant'
