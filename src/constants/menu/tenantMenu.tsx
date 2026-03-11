import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  SettingOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import type { MenuItem } from './platformMenu'
import i18n from '@/locales'

export const getTenantMenuItems = (): MenuItem[] => [
  { path: '', icon: <DashboardOutlined />, name: i18n.t('menu:home'), permission: 'tenant:admin:dashboard:view' },
  { path: 'order', icon: <ShoppingCartOutlined />, name: i18n.t('menu:orderManagement'), permission: 'tenant:admin:order:view' },
  { path: 'product', icon: <ShopOutlined />, name: i18n.t('menu:productManagement'), permission: 'tenant:admin:product:view' },
  { path: 'setting', icon: <SettingOutlined />, name: i18n.t('menu:storeSetting'), permission: 'tenant:admin:setting:view' },
  {
    path: 'system',
    icon: <SettingOutlined />,
    name: i18n.t('menu:systemManagement'),
    children: [
      { path: 'system/user', icon: <UserOutlined />, name: i18n.t('menu:userManagement'), permission: 'tenant:admin:auth:user:view' },
      { path: 'system/role', icon: <SafetyCertificateOutlined />, name: i18n.t('menu:roleManagement'), permission: 'tenant:admin:auth:role:view' },
      { path: 'system/menu', icon: <MenuOutlined />, name: i18n.t('menu:menuManagement'), permission: 'tenant:admin:auth:menu:view' },
    ],
  },
]

/** 根据路径获取商户后台菜单名称 */
export const getTenantMenuLabelByPath = (path: string): string => {
  // 从 /tenant-admin/123/order 中提取最后一段 "order"
  const match = path.match(/^\/tenant-admin\/[^/]+(?:\/(.+))?$/)
  const subPath = match?.[1] || ''
  const findLabel = (items: MenuItem[]): string | null => {
    for (const item of items) {
      if (item.path === subPath) return item.name
      if (item.children) {
        const found = findLabel(item.children)
        if (found) return found
      }
    }
    return null
  }
  const foundLabel = findLabel(getTenantMenuItems())
  if (foundLabel) return foundLabel
  return path
}
