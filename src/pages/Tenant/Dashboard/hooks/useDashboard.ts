import { useQuery } from '@tanstack/react-query'
import { getDashboardStats, getRecentOrders } from '@/api/modules/tenant'
import { queryKeys } from '@/hooks/query'

/** 仪表盘统计数据查询（1 分钟内不重新请求） */
export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: queryKeys.tenant.dashboardStats,
    queryFn: getDashboardStats,
    staleTime: 60 * 1000,
  })
}

/** 近期订单查询（1 分钟内不重新请求） */
export const useRecentOrdersQuery = () => {
  return useQuery({
    queryKey: queryKeys.tenant.recentOrders,
    queryFn: getRecentOrders,
    staleTime: 60 * 1000,
  })
}
