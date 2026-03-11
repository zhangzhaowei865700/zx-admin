import {
  DashboardOutlined,
  ShopOutlined,
  SettingOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
  MailOutlined,
} from '@ant-design/icons'
import i18n from '@/locales'

export interface MenuItem {
  path: string
  icon: React.ReactNode
  name: string
  permission?: string
  children?: MenuItem[]
  group?: string
}

export const getPlatformMenuItems = (): MenuItem[] => [
  { path: '/', icon: <DashboardOutlined />, name: i18n.t('menu:home'), permission: 'dashboard:view', group: i18n.t('menu:dashboard') },
  { path: '/tenant', icon: <ShopOutlined />, name: i18n.t('menu:tenantManagement'), permission: 'tenant:view', group: i18n.t('menu:business') },
  {
    path: '/system',
    icon: <SettingOutlined />,
    name: i18n.t('menu:systemManagement'),
    group: i18n.t('menu:system'),
    children: [
      { path: '/system/user', icon: <UserOutlined />, name: i18n.t('menu:userManagement'), permission: 'system:user:view' },
      { path: '/system/role', icon: <SafetyCertificateOutlined />, name: i18n.t('menu:roleManagement'), permission: 'system:role:view' },
      { path: '/system/menu', icon: <MenuOutlined />, name: i18n.t('menu:menuManagement'), permission: 'system:menu:view' },
    ],
  },
  { path: '/inbox', icon: <MailOutlined />, name: i18n.t('menu:inbox'), permission: 'message:view', group: i18n.t('menu:message') },
]

/** 根据路径获取菜单名称（支持子菜单） */
export const getPlatformMenuLabelByPath = (path: string): string => {
  for (const item of getPlatformMenuItems()) {
    if (item.path === path) return item.name
    if (item.children) {
      const child = item.children.find((c) => c.path === path)
      if (child) return child.name
    }
  }
  return path
}
