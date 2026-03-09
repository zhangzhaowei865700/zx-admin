// 商户订单
export interface TenantOrder {
  id: number
  orderNo: string
  customerName: string
  amount: number
  status: number
  createdAt: string
}

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

// 商户店铺设置
export interface StoreSetting {
  storeName: string
  storeDesc?: string
  storeLogo?: string
  contactPhone?: string
  contactEmail?: string
  address?: string
  isOpen: boolean
  autoConfirm: boolean
}

// 商户仪表盘统计
export interface DashboardStats {
  todayOrders: number
  todayRevenue: number
  totalProducts: number
  totalCustomers: number
}
