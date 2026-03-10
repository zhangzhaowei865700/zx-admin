import request from '@/api/request'
import type { PageResult, PageParams } from '@/api/types'
import type { TenantProduct } from '@/types/tenant'

export interface ProductParams extends PageParams {
  name?: string
  category?: string
  status?: number
}

export const getProductList = (params: ProductParams) =>
  request<PageResult<TenantProduct>>({
    url: '/api/tenant/product/list',
    method: 'POST',
    data: params,
  })

export const createProduct = (data: Partial<TenantProduct>) =>
  request({
    url: '/api/tenant/product',
    method: 'POST',
    data,
  })

export const updateProduct = (id: number, data: Partial<TenantProduct>) =>
  request({
    url: `/api/tenant/product/${id}`,
    method: 'PUT',
    data,
  })

export const deleteProduct = (id: number) =>
  request({
    url: `/api/tenant/product/${id}`,
    method: 'DELETE',
  })

export const batchDeleteProducts = (ids: number[]) =>
  request({
    url: '/api/tenant/product/batch',
    method: 'DELETE',
    data: { ids },
  })

export const batchUpdateProductStatus = (ids: number[], status: number) =>
  request({
    url: '/api/tenant/product/batch-status',
    method: 'PUT',
    data: { ids, status },
  })
