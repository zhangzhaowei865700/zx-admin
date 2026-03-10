import type { PageParams } from '../index'

export interface OrderParams extends PageParams {
  orderNo?: string
  customerName?: string
  status?: number
}
