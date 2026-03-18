import type { RouteObject } from 'react-router-dom'
import { tenantRouteConfig, generateRoutes } from '@/config/routes'

/**
 * 租户路由（从统一配置自动生成）
 */
export const tenantRoutes: RouteObject[] = generateRoutes(tenantRouteConfig)
