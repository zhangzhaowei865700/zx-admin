import { useQuery } from '@tanstack/react-query'
import { getAllRoles } from '@/api/modules/platform/system'
import { queryKeys } from '@/hooks/query'

/**
 * 获取所有角色列表（用于下拉选项）
 * staleTime 5 分钟：角色数据变动频率低，避免重复请求
 */
export const useSystemRolesQuery = () => {
  return useQuery({
    queryKey: queryKeys.system.allRoles,
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000,
  })
}
