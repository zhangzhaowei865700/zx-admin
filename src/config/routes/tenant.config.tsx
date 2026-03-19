import { lazy } from 'react'
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  SettingOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import i18n from '@/locales'
import type { AppRouteConfig, MenuItem } from './types'
import { generateMenuItems, getMenuLabelByPath } from './types'

const TenantDashboard = lazy(() =>
  import('@/pages/Tenant/Dashboard').then((m) => ({ default: m.TenantDashboardPage }))
)
const TenantOrder = lazy(() =>
  import('@/pages/Tenant/Order').then((m) => ({ default: m.TenantOrderPage }))
)
const TenantProduct = lazy(() =>
  import('@/pages/Tenant/Product').then((m) => ({ default: m.TenantProductPage }))
)
const TenantSetting = lazy(() =>
  import('@/pages/Tenant/Setting').then((m) => ({ default: m.TenantSettingPage }))
)
const TenantSystem = lazy(() =>
  import('@/pages/Tenant/System').then((m) => ({ default: m.TenantSystemPage }))
)
const TenantSystemUser = lazy(() =>
  import('@/pages/Tenant/System').then((m) => ({ default: m.TenantUserPage }))
)
const TenantSystemRole = lazy(() =>
  import('@/pages/Tenant/System').then((m) => ({ default: m.TenantRolePage }))
)
const TenantSystemMenu = lazy(() =>
  import('@/pages/Tenant/System').then((m) => ({ default: m.TenantMenuPage }))
)

/**
 * 租户后台统一路由配置（函数形式，每次调用动态获取 i18n 翻译）
 */
export const getTenantRouteConfig = (): AppRouteConfig[] => [
  {
    index: true,
    path: '',
    component: TenantDashboard,
    name: i18n.t('menu:home'),
    icon: <DashboardOutlined />,
    permission: 'tenant:list:backend:dashboard',
  },
  {
    path: 'order',
    component: TenantOrder,
    name: i18n.t('menu:orderManagement'),
    icon: <ShoppingCartOutlined />,
    permission: 'tenant:list:backend:order:view',
  },
  {
    path: 'product',
    component: TenantProduct,
    name: i18n.t('menu:productManagement'),
    icon: <ShopOutlined />,
    permission: 'tenant:list:backend:product:view',
  },
  {
    path: 'setting',
    component: TenantSetting,
    name: i18n.t('menu:storeSetting'),
    icon: <SettingOutlined />,
    permission: 'tenant:list:backend:setting:view',
  },
  {
    path: 'system',
    component: TenantSystem,
    name: i18n.t('menu:systemManagement'),
    icon: <SettingOutlined />,
    children: [
      { index: true, redirectTo: 'user' },
      {
        path: 'user',
        component: TenantSystemUser,
        name: i18n.t('menu:userManagement'),
        icon: <UserOutlined />,
        permission: 'tenant:list:backend:system:user:view',
      },
      {
        path: 'role',
        component: TenantSystemRole,
        name: i18n.t('menu:roleManagement'),
        icon: <SafetyCertificateOutlined />,
        permission: 'tenant:list:backend:system:role:view',
      },
      {
        path: 'menu',
        component: TenantSystemMenu,
        name: i18n.t('menu:menuManagement'),
        icon: <MenuOutlined />,
        permission: 'tenant:list:backend:system:menu:view',
      },
    ],
  },
]

/** 兼容路由注册使用（路由结构不依赖翻译，只需初始化一次） */
export const tenantRouteConfig: AppRouteConfig[] = getTenantRouteConfig()

/**
 * 租户菜单（每次调用动态生成，确保语言切换后名称更新）
 */
export const getTenantMenuItems = (): MenuItem[] => generateMenuItems(getTenantRouteConfig())

/**
 * 根据路径获取租户菜单名称
 * 从 /tenant-admin/123/order 中提取 "order" 并查找对应菜单名
 */
export const getTenantMenuLabelByPath = (path: string): string => {
  const match = path.match(/^\/tenant-admin\/[^/]+(?:\/(.+))?$/)
  const subPath = match?.[1] || ''
  return getMenuLabelByPath(getTenantMenuItems(), subPath)
}
