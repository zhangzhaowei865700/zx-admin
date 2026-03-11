import request from '@/api/request'
import type { PageResult, TenantProduct, ProductParams, ProductSpec } from '@/types'

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

// 商品规格 API
export const getProductSpecs = (productId: number) =>
  request<ProductSpec[]>({
    url: `/api/tenant/product/${productId}/specs`,
    method: 'GET',
  })

export const saveProductSpec = (productId: number, data: Partial<ProductSpec>) =>
  request({
    url: `/api/tenant/product/${productId}/spec`,
    method: 'POST',
    data,
  })

export const deleteProductSpec = (productId: number, specId: number) =>
  request({
    url: `/api/tenant/product/${productId}/spec/${specId}`,
    method: 'DELETE',
  })

export type { ProductParams } from '@/types'
