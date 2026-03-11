import type { PageParams } from '../index'

// 商户商品
export interface TenantProduct {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  unit: string
  status: number
  createdAt: string
}

export interface ProductParams extends PageParams {
  name?: string
  category?: string
  status?: number
}

// 商品规格
export interface ProductSpec {
  id: number
  productId: number
  specName: string
  specValue: string
  price: number
  stock: number
  sort: number
}
