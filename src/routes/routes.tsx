import { type RouteObject } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { platformRoutes } from './modules/platform'
import { tenantRoutes } from './modules/tenant'
import { AppLayout } from '@/components/layout/AppLayout'
import { TenantLayout } from '@/components/layout/TenantLayout'

const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.LoginPage })))

const LoginFallback = () => (
  <div style={{ display: 'flex', height: '100vh' }}>
    <div style={{ flex: 1, background: 'linear-gradient(145deg, #001529 0%, #003a8c 50%, #0050b3 100%)' }} />
    <div style={{ width: 480, background: '#fff' }} />
  </div>
)
const NotFound = lazy(() => import('@/pages/Exception/404').then((m) => ({ default: m.NotFoundPage })))
const Forbidden = lazy(() => import('@/pages/Exception/403').then((m) => ({ default: m.ForbiddenPage })))

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Suspense fallback={<LoginFallback />}><Login /></Suspense>,
  },
  {
    path: '/403',
    element: <Forbidden />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: platformRoutes,
  },
  {
    path: '/tenant-admin/:tenantId',
    element: <TenantLayout />,
    children: tenantRoutes,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]
