import type { PageParams } from '../index'

// 商户订单
export interface TenantOrder {
  id: number
  orderNo: string
  customerName: string
  amount: number
  status: number
  createdAt: string
}

export interface OrderParams extends PageParams {
  orderNo?: string
  customerName?: string
  status?: number
}
