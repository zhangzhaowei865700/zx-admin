import {lazy} from 'react'
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
import type {AppRouteConfig, MenuItem} from './types'
import {generateMenuItems, getMenuLabelByPath} from './types'

const Dashboard = lazy(() => import('@/pages/Platform/Dashboard').then((m) => ({default: m.DashboardPage})))
const Tenant = lazy(() => import('@/pages/Platform/Tenant').then((m) => ({default: m.TenantPage})))
const System = lazy(() => import('@/pages/Platform/System').then((m) => ({default: m.SystemPage})))
const SystemUser = lazy(() => import('@/pages/Platform/System/User').then((m) => ({default: m.UserPage})))
const SystemRole = lazy(() => import('@/pages/Platform/System/Role').then((m) => ({default: m.RolePage})))
const SystemMenu = lazy(() => import('@/pages/Platform/System/Menu').then((m) => ({default: m.MenuPage})))
const MessageInbox = lazy(() => import('@/pages/Platform/Message').then((m) => ({default: m.InboxPage})))

/**
 * 平台级统一路由配置
 * 同时定义路由和菜单，单一数据源
 */
export const platformRouteConfig: AppRouteConfig[] = [
    {
        index: true,
        path: '/',
        component: Dashboard,
        name: i18n.t('menu:home'),
        icon: <DashboardOutlined/>,
        permission: 'dashboard',
        group: i18n.t('menu:dashboard'),
    },
    {
        path: '/tenant',
        component: Tenant,
        name: i18n.t('menu:tenantManagement'),
        icon: <ShopOutlined/>,
        permission: 'tenant:list',
        group: i18n.t('menu:business'),
    },
    {
        path: '/inbox',
        component: MessageInbox,
        name: i18n.t('menu:inbox'),
        icon: <MailOutlined/>,
        permission: 'message',
        group: i18n.t('menu:message'),
    },
    {
        path: '/system',
        component: System,
        name: i18n.t('menu:systemManagement'),
        icon: <SettingOutlined/>,
        group: i18n.t('menu:system'),
        children: [
            { index: true, redirectTo: '/system/user' },
            {
                path: 'user',
                component: SystemUser,
                name: i18n.t('menu:userManagement'),
                icon: <UserOutlined/>,
                permission: 'system:user:view',
            },
            {
                path: 'role',
                component: SystemRole,
                name: i18n.t('menu:roleManagement'),
                icon: <SafetyCertificateOutlined/>,
                permission: 'system:role:view',
            },
            {
                path: 'menu',
                component: SystemMenu,
                name: i18n.t('menu:menuManagement'),
                icon: <MenuOutlined/>,
                permission: 'system:menu:view',
            },
        ],
    },
]

/**
 * 平台菜单（从统一配置生成）
 */
export const getPlatformMenuItems = (): MenuItem[] => generateMenuItems(platformRouteConfig)

/**
 * 根据路径获取平台菜单名称
 */
export const getPlatformMenuLabelByPath = (path: string): string => {
    return getMenuLabelByPath(getPlatformMenuItems(), path)
}
