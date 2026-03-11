import request from '@/api/request'
import type {
  PageResult,
  TenantAuthUser,
  TenantAuthRole,
  TenantAuthMenuItem,
  TenantDept,
  TenantAuthUserParams,
  TenantAuthRoleParams,
  TenantClientType,
} from '@/types'

// ==================== 用户 ====================

export const getTenantAuthUserList = (params: TenantAuthUserParams) =>
  request<PageResult<TenantAuthUser>>({
    url: '/api/tenant/auth/user/list',
    method: 'POST',
    data: params,
  })

export const createTenantAuthUser = (data: Partial<TenantAuthUser> & { username: string }) =>
  request({
    url: '/api/tenant/auth/user',
    method: 'POST',
    data,
  })

export const updateTenantAuthUser = (id: number, data: Partial<TenantAuthUser>) =>
  request({
    url: `/api/tenant/auth/user/${id}`,
    method: 'PUT',
    data,
  })

export const deleteTenantAuthUser = (id: number) =>
  request({
    url: `/api/tenant/auth/user/${id}`,
    method: 'DELETE',
  })

// ==================== 角色 ====================

export const getTenantAuthRoleList = (params: TenantAuthRoleParams) =>
  request<PageResult<TenantAuthRole>>({
    url: '/api/tenant/auth/role/list',
    method: 'POST',
    data: params,
  })

export const getTenantAllRoles = () =>
  request<TenantAuthRole[]>({
    url: '/api/tenant/auth/role/all',
    method: 'GET',
  })

export const createTenantAuthRole = (data: Partial<TenantAuthRole> & { name: string; code: string }) =>
  request({
    url: '/api/tenant/auth/role',
    method: 'POST',
    data,
  })

export const updateTenantAuthRole = (id: number, data: Partial<TenantAuthRole>) =>
  request({
    url: `/api/tenant/auth/role/${id}`,
    method: 'PUT',
    data,
  })

export const deleteTenantAuthRole = (id: number) =>
  request({
    url: `/api/tenant/auth/role/${id}`,
    method: 'DELETE',
  })

export const batchDeleteTenantRoles = (ids: number[]) =>
  request({
    url: '/api/tenant/auth/role/batch',
    method: 'DELETE',
    data: { ids },
  })

export const updateTenantRolePermission = (
  id: number,
  data: { clientType: TenantClientType; menuIds: number[]; deptIds: number[] },
) =>
  request({
    url: `/api/tenant/auth/role/${id}/permission`,
    method: 'PUT',
    data,
  })

// ==================== 菜单 ====================

export const getTenantMenuTree = (clientType: TenantClientType) =>
  request<TenantAuthMenuItem[]>({
    url: '/api/tenant/auth/menu/tree',
    method: 'GET',
    params: { clientType },
  })

export const createTenantAuthMenu = (data: Omit<TenantAuthMenuItem, 'id' | 'createdAt' | 'children'>) =>
  request({
    url: '/api/tenant/auth/menu',
    method: 'POST',
    data,
  })

export const updateTenantAuthMenu = (id: number, data: Partial<TenantAuthMenuItem>) =>
  request({
    url: `/api/tenant/auth/menu/${id}`,
    method: 'PUT',
    data,
  })

export const deleteTenantAuthMenu = (id: number) =>
  request({
    url: `/api/tenant/auth/menu/${id}`,
    method: 'DELETE',
  })

// ==================== 部门 ====================

export const getTenantDeptTree = (clientType: TenantClientType) =>
  request<TenantDept[]>({
    url: '/api/tenant/auth/dept/tree',
    method: 'GET',
    params: { clientType },
  })

export type {
  TenantAuthUser,
  TenantAuthRole,
  TenantAuthMenuItem,
  TenantDept,
  TenantAuthUserParams,
  TenantAuthRoleParams,
  TenantAuthMenuParams,
  TenantClientType,
  DataScopeType,
} from '@/types'
