import { getTenantAllRoles } from '@/api/modules/tenant'
import { queryKeys } from '@/hooks/query'
import { useQuery } from '@tanstack/react-query'

/** 获取租户所有角色（下拉选项用），5 分钟内不重新请求 */
export const useTenantSystemRolesQuery = () => {
  return useQuery({
    queryKey: queryKeys.tenant.allRoles,
    queryFn: getTenantAllRoles,
    staleTime: 5 * 60 * 1000,
  })
}
