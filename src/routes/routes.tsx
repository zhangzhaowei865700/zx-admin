import { type RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import { platformRoutes } from './modules/platform'
import { tenantRoutes } from './modules/tenant'
import { AppLayout } from '@/components/layout/AppLayout'
import { TenantLayout } from '@/components/layout/TenantLayout'

const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.LoginPage })))
const NotFound = lazy(() => import('@/pages/Exception/404').then((m) => ({ default: m.NotFoundPage })))
const Forbidden = lazy(() => import('@/pages/Exception/403').then((m) => ({ default: m.ForbiddenPage })))

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
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
