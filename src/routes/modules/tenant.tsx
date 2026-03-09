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

export const tenantRoutes: RouteObject[] = [
  { index: true, element: <TenantDashboard /> },
  { path: 'order', element: <TenantOrder /> },
  { path: 'product', element: <TenantProduct /> },
  { path: 'setting', element: <TenantSetting /> },
]
