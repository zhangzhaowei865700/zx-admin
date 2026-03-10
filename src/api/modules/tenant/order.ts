import request from '@/api/request'
import type { PageResult, TenantOrder, OrderParams } from '@/types'

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

export type { OrderParams } from '@/types'
