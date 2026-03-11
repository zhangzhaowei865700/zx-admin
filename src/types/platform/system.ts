import type { PageParams } from '../index'

// ==================== 用户管理 ====================

export interface SystemUser {
  id: number
  username: string
  nickname: string
  phone?: string
  email?: string
  avatar?: string
  roleIds?: number[]
  roleNames?: string[]
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

// ==================== 角色管理 ====================

export interface Role {
  id: number
  name: string
  code: string
  description?: string
  menuIds?: number[]
  deptIds?: number[]
  status: number
  createdAt: string
  updatedAt?: string
}

export interface RoleParams extends PageParams {
  name?: string
  code?: string
  status?: number
}

// ==================== 菜单管理 ====================

export interface Menu {
  id: number
  parentId: number
  name: string
  path?: string
  icon?: string
  component?: string
  permission?: string
  type: number
  sort: number
  visible: number
  status: number
  children?: Menu[]
  createdAt: string
  updatedAt?: string
}

// ==================== 部门管理 ====================

export interface Dept {
  id: number
  parentId: number
  name: string
  sort: number
  status: number
  children?: Dept[]
}
