import { memo } from 'react'
import { Navigate, matchRoutes, useLocation } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'
import { getToken } from '@/utils/storage'
import { routes } from './routes'

const WHITE_LIST = ['/login', '/403', '/404']

type RouteHandle = { permission?: string }

const getRequiredPermission = (pathname: string): string | undefined => {
  const matches = matchRoutes(routes, pathname)
  if (!matches) return undefined

  for (let i = matches.length - 1; i >= 0; i -= 1) {
    const handle = matches[i].route.handle as RouteHandle | undefined
    if (handle?.permission) return handle.permission
  }

  return undefined
}

export const Guard = memo(function Guard({ children }: { children: React.ReactNode }) {
  const { permissions, _hasHydrated } = useUserStore()
  const token = getToken()
  const location = useLocation()
  const normalizedPath = location.pathname.replace(/\/+$/, '') || '/'

  // 等待 Zustand persist 从 localStorage 恢复完成
  if (!_hasHydrated) {
    return null
  }

  if (!token && normalizedPath !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (token && normalizedPath === '/login') {
    const params = new URLSearchParams(location.search)
    if (!params.get('switch')) {
      return <Navigate to="/" replace />
    }
  }

  // permissions is empty: allow all (for backend-not-ready compatibility)
  if (token && permissions.length > 0 && !WHITE_LIST.includes(normalizedPath)) {
    const requiredPermission = getRequiredPermission(normalizedPath)
    if (requiredPermission && !permissions.includes(requiredPermission)) {
      return <Navigate to="/403" replace />
    }
  }

  return <>{children}</>
})
