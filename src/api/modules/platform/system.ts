import request from '@/api/request'
import type { PageResult, PageParams } from '@/api/types'

// ==================== 用户管理 ====================

export interface SystemUser {
  id: number
  username: string
  nickname: string
  phone?: string
  email?: string
  avatar?: string
  roleId?: number
  roleName?: string
  status: number
  createdAt: string
  updatedAt?: string
}

export interface SystemUserParams extends PageParams {
  username?: string
  nickname?: string
  phone?: string
  status?: number
}

export const getUserList = (params: SystemUserParams) =>
  request<PageResult<SystemUser>>({
    url: '/api/admin/system/user/list',
    method: 'POST',
    data: params,
  })

export const getUserDetail = (id: number) =>
  request<SystemUser>({
    url: `/api/admin/system/user/${id}`,
    method: 'GET',
  })

export const createUser = (data: Partial<SystemUser> & { password?: string }) =>
  request({
    url: '/api/admin/system/user',
    method: 'POST',
    data,
  })

export const updateUser = (id: number, data: Partial<SystemUser>) =>
  request({
    url: `/api/admin/system/user/${id}`,
    method: 'PUT',
    data,
  })

export const deleteUser = (id: number) =>
  request({
    url: `/api/admin/system/user/${id}`,
    method: 'DELETE',
  })

export const batchDeleteUsers = (ids: number[]) =>
  request({
    url: '/api/admin/system/user/batch',
    method: 'DELETE',
    data: { ids },
  })

export const batchUpdateUserStatus = (ids: number[], status: number) =>
  request({
    url: '/api/admin/system/user/batch-status',
    method: 'PUT',
    data: { ids, status },
  })

export const resetUserPassword = (id: number, password: string) =>
  request({
    url: `/api/admin/system/user/${id}/reset-password`,
    method: 'PUT',
    data: { password },
  })

// ==================== 角色管理 ====================

export interface Role {
  id: number
  name: string
  code: string
  description?: string
  menuIds?: number[] // 菜单权限
  deptIds?: number[] // 数据权限（部门树选择）
  status: number
  createdAt: string
  updatedAt?: string
}

export interface RoleParams extends PageParams {
  name?: string
  code?: string
  status?: number
}

export const getRoleList = (params: RoleParams) =>
  request<PageResult<Role>>({
    url: '/api/admin/system/role/list',
    method: 'POST',
    data: params,
  })

export const getRoleDetail = (id: number) =>
  request<Role>({
    url: `/api/admin/system/role/${id}`,
    method: 'GET',
  })

export const createRole = (data: Partial<Role>) =>
  request({
    url: '/api/admin/system/role',
    method: 'POST',
    data,
  })

export const updateRole = (id: number, data: Partial<Role>) =>
  request({
    url: `/api/admin/system/role/${id}`,
    method: 'PUT',
    data,
  })

export const updateRolePermission = (id: number, data: { menuIds: number[]; deptIds: number[] }) =>
  request({
    url: `/api/admin/system/role/${id}/permission`,
    method: 'PUT',
    data,
  })

export const deleteRole = (id: number) =>
  request({
    url: `/api/admin/system/role/${id}`,
    method: 'DELETE',
  })

export const batchDeleteRoles = (ids: number[]) =>
  request({
    url: '/api/admin/system/role/batch',
    method: 'DELETE',
    data: { ids },
  })

export const getAllRoles = () =>
  request<Role[]>({
    url: '/api/admin/system/role/all',
    method: 'GET',
  })

// ==================== 菜单管理 ====================

export interface Menu {
  id: number
  parentId: number
  name: string
  path?: string
  icon?: string
  component?: string
  permission?: string
  type: number // 1:目录 2:菜单 3:按钮
  sort: number
  visible: number // 1:显示 0:隐藏
  status: number
  children?: Menu[]
  createdAt: string
  updatedAt?: string
}

export const getMenuTree = () =>
  request<Menu[]>({
    url: '/api/admin/system/menu/tree',
    method: 'GET',
  })

export const getMenuDetail = (id: number) =>
  request<Menu>({
    url: `/api/admin/system/menu/${id}`,
    method: 'GET',
  })

export const createMenu = (data: Partial<Menu>) =>
  request({
    url: '/api/admin/system/menu',
    method: 'POST',
    data,
  })

export const updateMenu = (id: number, data: Partial<Menu>) =>
  request({
    url: `/api/admin/system/menu/${id}`,
    method: 'PUT',
    data,
  })

export const deleteMenu = (id: number) =>
  request({
    url: `/api/admin/system/menu/${id}`,
    method: 'DELETE',
  })

// ==================== 部门管理 ====================

export interface Dept {
  id: number
  parentId: number
  name: string
  sort: number
  status: number
  children?: Dept[]
}

export const getDeptTree = () =>
  request<Dept[]>({
    url: '/api/admin/system/dept/tree',
    method: 'GET',
  })
