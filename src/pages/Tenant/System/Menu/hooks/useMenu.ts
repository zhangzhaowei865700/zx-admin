import { message } from 'antd'
import type { ActionType } from '@ant-design/pro-components'
import type { RefObject } from 'react'
import {
  getTenantMenuTree,
  createTenantAuthMenu,
  updateTenantAuthMenu,
  deleteTenantAuthMenu,
  type TenantClientType,
} from '@/api/modules/tenant'
import { queryKeys } from '@/hooks/query'
import { useQuery, useMutation } from '@tanstack/react-query'

/** 获取租户菜单树（带缓存） */
export const useTenantMenuTreeQuery = (clientType: TenantClientType) => {
  return useQuery({
    queryKey: clientType === 'admin' ? queryKeys.tenant.adminMenuTree : queryKeys.tenant.miniappMenuTree,
    queryFn: () => getTenantMenuTree(clientType),
    staleTime: 5 * 60 * 1000,
  })
}

/** 租户菜单 CUD Mutations */
export const useTenantMenuMutations = (actionRef: RefObject<ActionType | undefined>) => {
  const submit = useMutation({
    mutationFn: ({ id, values }: { id?: number; values: Record<string, any> }) =>
      id ? updateTenantAuthMenu(id, values) : createTenantAuthMenu(values as any),
    onSuccess: (_, { id }) => {
      message.success(id ? '更新成功' : '创建成功')
      actionRef.current?.reload()
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteTenantAuthMenu(id),
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
  })

  return { submit, remove }
}
