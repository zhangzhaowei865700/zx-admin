import { memo } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'

// 不需要权限校验的白名单路由
const WHITE_LIST = ['/login', '/403', '/404']

export const Guard = memo(function Guard({ children }: { children: React.ReactNode }) {
  const { token, permissions } = useUserStore()
  const location = useLocation()

  if (!token && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 已登录用户访问 /login 时，带 ?switch=1 允许进入（切换平台），否则重定向
  if (token && location.pathname === '/login') {
    const params = new URLSearchParams(location.search)
    if (!params.get('switch')) {
      return <Navigate to="/" replace />
    }
  }

  // 权限校验：permissions 为空时视为拥有全部权限（兼容后端未对接的情况）
  if (token && permissions.length > 0 && !WHITE_LIST.includes(location.pathname)) {
    const hasPermission = permissions.some((p) => {
      const normalizedPath = location.pathname.replace(/\/+$/, '')
      const normalizedPerm = p.replace(/\/+$/, '')
      return normalizedPath === normalizedPerm || normalizedPath.startsWith(normalizedPerm + '/')
    })
    if (!hasPermission) {
      return <Navigate to="/403" replace />
    }
  }

  return <>{children}</>
})
