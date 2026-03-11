import type { PageParams } from '../index'

export type TenantClientType = 'admin' | 'miniapp'

export type DataScopeType = 'self' | 'dept' | 'dept_and_sub' | 'custom' | 'all'

export interface TenantAuthUser {
  id: number
  username: string
  nickname: string
  status: number
  roleIds: number[]
  roleNames: string[]
  enabledClients: TenantClientType[]
  dataScopes: Record<TenantClientType, DataScopeType>
  createdAt: string
}

export interface TenantAuthRole {
  id: number
  name: string
  code: string
  status: number
  description?: string
  adminMenuIds?: number[]
  miniappMenuIds?: number[]
  adminDeptIds?: number[]
  miniappDeptIds?: number[]
  createdAt: string
}

export interface TenantAuthMenuItem {
  id: number
  parentId: number
  name: string
  path?: string
  icon?: string
  component?: string
  permission?: string
  clientType: TenantClientType
  type: number
  sort: number
  visible: number
  status: number
  children?: TenantAuthMenuItem[]
  createdAt: string
}

export interface TenantDept {
  id: number
  parentId: number
  name: string
  sort: number
  status: number
  children?: TenantDept[]
}

export interface TenantAuthUserParams extends PageParams {
  keyword?: string
  status?: number
  clientType?: TenantClientType
  dataScope?: DataScopeType
}

export interface TenantAuthRoleParams extends PageParams {
  keyword?: string
  status?: number
}

export interface TenantAuthMenuParams {
  clientType: TenantClientType
}
