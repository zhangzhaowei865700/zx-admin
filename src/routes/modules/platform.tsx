import type { RouteObject } from 'react-router-dom'
import { platformRouteConfig, generateRoutes } from '@/config/routes'

/**
 * 平台路由（从统一配置自动生成）
 */
export const platformRoutes: RouteObject[] = generateRoutes(platformRouteConfig)
