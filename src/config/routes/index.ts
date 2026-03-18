// 类型和工具函数
export type { AppRouteConfig, MenuItem } from './types'
export { generateRoutes, generateMenuItems, getMenuLabelByPath } from './types'

// 平台级
export { platformRouteConfig, getPlatformMenuItems, getPlatformMenuLabelByPath } from './platform.config.js'

// 租户级
export { tenantRouteConfig, getTenantMenuItems, getTenantMenuLabelByPath } from './tenant.config.js'
