import request from '@/api/request'
import type { TenantOrder, DashboardStats } from '@/types/tenant'

export const getDashboardStats = () =>
  request<DashboardStats>({
    url: '/api/tenant/dashboard/stats',
    method: 'GET',
  })

export const getRecentOrders = () =>
  request<TenantOrder[]>({
    url: '/api/tenant/dashboard/recent-orders',
    method: 'GET',
  })
