/**
 * React Query 缓存 key 统一管理
 * 通过集中管理 queryKey 避免字符串硬编码，便于缓存失效和追踪
 */
export const queryKeys = {
  system: {
    /** 所有角色列表（下拉选项用） */
    allRoles: ['system', 'roles', 'all'] as const,
    /** 用户列表 */
    users: (params?: Record<string, any>) => ['system', 'users', params] as const,
    /** 角色列表 */
    roles: (params?: Record<string, any>) => ['system', 'roles', params] as const,
    /** 菜单树 */
    menus: ['system', 'menus'] as const,
    /** 部门树 */
    depts: ['system', 'depts'] as const,
  },
  platform: {
    /** 租户列表 */
    tenants: (params?: Record<string, any>) => ['platform', 'tenants', params] as const,
    /** 消息列表 */
    messages: (params?: Record<string, any>) => ['platform', 'messages', params] as const,
    /** 消息未读数 */
    unreadCount: ['platform', 'messages', 'unread'] as const,
  },
  tenant: {
    /** 订单列表 */
    orders: (params?: Record<string, any>) => ['tenant', 'orders', params] as const,
    /** 商品列表 */
    products: (params?: Record<string, any>) => ['tenant', 'products', params] as const,
    /** 仪表盘统计数据 */
    dashboardStats: ['tenant', 'dashboard', 'stats'] as const,
    /** 仪表盘近期订单 */
    recentOrders: ['tenant', 'dashboard', 'recentOrders'] as const,
  },
} as const
