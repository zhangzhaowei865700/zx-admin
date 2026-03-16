import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

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

export const tenantRoutes: RouteObject[] = [
  { index: true, element: <TenantDashboard />, handle: { permission: 'dashboard' } },
  { path: 'order', element: <TenantOrder />, handle: { permission: 'order:list:view' } },
  { path: 'product', element: <TenantProduct />, handle: { permission: 'product:list:view' } },
  { path: 'setting', element: <TenantSetting />, handle: { permission: 'setting:view' } },
  {
    path: 'system',
    element: <TenantSystem />,
    children: [
      { index: true, element: <TenantSystemUser />, handle: { permission: 'system:user:view' } },
      { path: 'user', element: <TenantSystemUser />, handle: { permission: 'system:user:view' } },
      { path: 'role', element: <TenantSystemRole />, handle: { permission: 'system:role:view' } },
      { path: 'menu', element: <TenantSystemMenu />, handle: { permission: 'system:menu:view' } },
    ],
  },
]
