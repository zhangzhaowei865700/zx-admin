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
  children?: MenuItem[]
}

export const getPlatformMenuItems = (): MenuItem[] => [
  { path: '/', icon: <DashboardOutlined />, name: i18n.t('menu:home') },
  { path: '/tenant', icon: <ShopOutlined />, name: i18n.t('menu:tenantManagement') },
  {
    path: '/system',
    icon: <SettingOutlined />,
    name: i18n.t('menu:systemManagement'),
    children: [
      { path: '/system/user', icon: <UserOutlined />, name: i18n.t('menu:userManagement') },
      { path: '/system/role', icon: <SafetyCertificateOutlined />, name: i18n.t('menu:roleManagement') },
      { path: '/system/menu', icon: <MenuOutlined />, name: i18n.t('menu:menuManagement') },
    ],
  },
  { path: '/inbox', icon: <MailOutlined />, name: i18n.t('menu:inbox') },
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
