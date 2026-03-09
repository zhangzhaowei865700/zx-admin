import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const Dashboard = lazy(() => import('@/pages/Platform/Dashboard').then((m) => ({ default: m.DashboardPage })))
const Tenant = lazy(() => import('@/pages/Platform/Tenant').then((m) => ({ default: m.TenantPage })))
const System = lazy(() => import('@/pages/Platform/System').then((m) => ({ default: m.SystemPage })))
const SystemUser = lazy(() => import('@/pages/Platform/System').then((m) => ({ default: m.UserPage })))
const SystemRole = lazy(() => import('@/pages/Platform/System').then((m) => ({ default: m.RolePage })))
const SystemMenu = lazy(() => import('@/pages/Platform/System').then((m) => ({ default: m.MenuPage })))
const MessageInbox = lazy(() => import('@/pages/Platform/Message').then((m) => ({ default: m.InboxPage })))

export const platformRoutes: RouteObject[] = [
  { index: true, element: <Dashboard /> },
  { path: 'tenant', element: <Tenant /> },
  { path: 'inbox', element: <MessageInbox /> },
  {
    path: 'system',
    element: <System />,
    children: [
      { index: true, element: <SystemUser /> },
      { path: 'user', element: <SystemUser /> },
      { path: 'role', element: <SystemRole /> },
      { path: 'menu', element: <SystemMenu /> },
    ],
  },
]
