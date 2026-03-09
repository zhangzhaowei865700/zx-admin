import request from '@/api/request'
import type { PageResult, PageParams } from '@/api/types'
import type { TenantOrder, TenantProduct, StoreSetting, DashboardStats } from '@/types/tenant'

// ==================== 订单管理 ====================

export interface OrderParams extends PageParams {
  orderNo?: string
  customerName?: string
  status?: number
}

export const getOrderList = (params: OrderParams) =>
  request<PageResult<TenantOrder>>({
    url: '/api/tenant/order/list',
    method: 'POST',
    data: params,
  })

export const deleteOrder = (id: number) =>
  request({
    url: `/api/tenant/order/${id}`,
    method: 'DELETE',
  })

export const batchDeleteOrders = (ids: number[]) =>
  request({
    url: '/api/tenant/order/batch',
    method: 'DELETE',
    data: { ids },
  })

// ==================== 商品管理 ====================

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

// ==================== 店铺设置 ====================

export const getStoreSetting = () =>
  request<StoreSetting>({
    url: '/api/tenant/setting',
    method: 'GET',
  })

export const updateStoreSetting = (data: StoreSetting) =>
  request({
    url: '/api/tenant/setting',
    method: 'PUT',
    data,
  })

// ==================== 仪表盘 ====================

export const getDashboardStats = () =>
  request<DashboardStats>({
    url: '/api/tenant/dashboard/stats',
    method: 'GET',
  })

export const getRecentOrders = () =>
  request<TenantOrder[]>({
    url: '/api/tenant/dashboard/recent-orders',
    method: 'GET',
  })
