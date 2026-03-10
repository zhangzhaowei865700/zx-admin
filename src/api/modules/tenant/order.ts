import request from '@/api/request'
import type { PageResult, PageParams } from '@/api/types'
import type { TenantOrder } from '@/types/tenant'

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
