import { message } from 'antd'
import type { ActionType } from '@ant-design/pro-components'
import type { RefObject } from 'react'
import {
  getTenantMenuTree,
  getTenantDeptTree,
  createTenantAuthRole,
  updateTenantAuthRole,
  deleteTenantAuthRole,
  batchDeleteTenantRoles,
  updateTenantRolePermission,
  type TenantAuthRole,
  type TenantClientType,
} from '@/api/modules/tenant'
import { queryKeys } from '@/hooks/query'
import { useQuery, useMutation } from '@tanstack/react-query'

/** 获取租户后台端菜单树，5 分钟内不重新请求 */
export const useTenantMenuTreeQuery = (clientType: TenantClientType) => {
  return useQuery({
    queryKey: clientType === 'admin' ? queryKeys.tenant.adminMenuTree : queryKeys.tenant.miniappMenuTree,
    queryFn: () => getTenantMenuTree(clientType),
    staleTime: 5 * 60 * 1000,
  })
}

/** 获取租户部门树，5 分钟内不重新请求 */
export const useTenantDeptTreeQuery = (clientType: TenantClientType) => {
  return useQuery({
    queryKey: clientType === 'admin' ? queryKeys.tenant.adminDeptTree : queryKeys.tenant.miniappDeptTree,
    queryFn: () => getTenantDeptTree(clientType),
    staleTime: 5 * 60 * 1000,
  })
}

/** 租户角色 CUD Mutations */
export const useTenantRoleMutations = (actionRef: RefObject<ActionType | undefined>) => {
  const submit = useMutation({
    mutationFn: ({ record, values }: { record?: TenantAuthRole; values: Record<string, any> }) =>
      record ? updateTenantAuthRole(record.id, values) : createTenantAuthRole(values as any),
    onSuccess: (_, { record }) => {
      message.success(record ? '更新成功' : '创建成功')
      actionRef.current?.reload()
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteTenantAuthRole(id),
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
  })

  const batchRemove = useMutation({
    mutationFn: (ids: number[]) => batchDeleteTenantRoles(ids),
    onSuccess: () => {
      message.success('批量删除成功')
      actionRef.current?.reload()
    },
  })

  const savePermission = useMutation({
    mutationFn: ({
      roleId,
      clientType,
      menuIds,
      deptIds,
    }: {
      roleId: number
      clientType: TenantClientType
      menuIds: number[]
      deptIds: number[]
    }) => updateTenantRolePermission(roleId, { clientType, menuIds, deptIds }),
    onSuccess: () => {
      message.success('权限保存成功')
      actionRef.current?.reload()
    },
  })

  return { submit, remove, batchRemove, savePermission }
}
