import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { MenuItem } from './platformMenu'
import i18n from '@/locales'

export const getTenantMenuItems = (): MenuItem[] => [
  { path: '', icon: <DashboardOutlined />, name: i18n.t('menu:home') },
  { path: 'order', icon: <ShoppingCartOutlined />, name: i18n.t('menu:orderManagement') },
  { path: 'product', icon: <ShopOutlined />, name: i18n.t('menu:productManagement') },
  { path: 'setting', icon: <SettingOutlined />, name: i18n.t('menu:storeSetting') },
]

/** 根据路径获取商户后台菜单名称 */
export const getTenantMenuLabelByPath = (path: string): string => {
  // 从 /tenant-admin/123/order 中提取最后一段 "order"
  const match = path.match(/^\/tenant-admin\/[^/]+(?:\/(.+))?$/)
  const subPath = match?.[1] || ''
  for (const item of getTenantMenuItems()) {
    if (item.path === subPath) return item.name
  }
  return path
}
