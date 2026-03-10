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
