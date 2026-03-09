import request from '@/api/request'
import type { PageResult, PageParams } from '@/api/types'

export interface Tenant {
  id: number
  name: string
  code?: string
  contact?: string
  phone?: string
  email?: string
  address?: string
  status: number
  createdAt: string
}

export interface TenantParams extends PageParams {
  name?: string
  status?: number
}

export const getTenantList = (params: TenantParams) =>
  request<PageResult<Tenant>>({
    url: '/api/admin/tenant/list',
    method: 'POST',
    data: params,
  })

export const getTenantDetail = (id: number) =>
  request<Tenant>({
    url: `/api/admin/tenant/${id}`,
    method: 'GET',
  })

export const createTenant = (data: Partial<Tenant>) =>
  request({
    url: '/api/admin/tenant',
    method: 'POST',
    data,
  })

export const updateTenant = (id: number, data: Partial<Tenant>) =>
  request({
    url: `/api/admin/tenant/${id}`,
    method: 'PUT',
    data,
  })

export const deleteTenant = (id: number) =>
  request({
    url: `/api/admin/tenant/${id}`,
    method: 'DELETE',
  })

export const batchDeleteTenants = (ids: number[]) =>
  request({
    url: '/api/admin/tenant/batch',
    method: 'DELETE',
    data: { ids },
  })

export const batchUpdateTenantStatus = (ids: number[], status: number) =>
  request({
    url: '/api/admin/tenant/batch-status',
    method: 'PUT',
    data: { ids, status },
  })
