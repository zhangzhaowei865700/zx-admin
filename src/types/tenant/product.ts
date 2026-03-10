import type { PageParams } from '../index'

// 商户商品
export interface TenantProduct {
  id: number
  name: string
  price: number
  stock: number
  category: string
  status: number
  createdAt: string
}

export interface ProductParams extends PageParams {
  name?: string
  category?: string
  status?: number
}
