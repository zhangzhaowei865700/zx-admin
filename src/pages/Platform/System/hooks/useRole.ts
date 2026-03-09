import { useQuery, useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import type { ActionType } from '@ant-design/pro-components'
import type { RefObject } from 'react'
import {
  getMenuTree,
  getDeptTree,
  createRole,
  updateRole,
  deleteRole,
  batchDeleteRoles,
  updateRolePermission,
  type Role,
} from '@/api/modules/platform/system'
import { queryKeys } from '@/hooks/query'

/** 获取菜单树（用于角色权限配置），5 分钟内不重新请求 */
export const useMenuTreeQuery = () => {
  return useQuery({
    queryKey: queryKeys.system.menus,
    queryFn: getMenuTree,
    staleTime: 5 * 60 * 1000,
  })
}

/** 获取部门树（用于角色数据权限配置），5 分钟内不重新请求 */
export const useDeptTreeQuery = () => {
  return useQuery({
    queryKey: queryKeys.system.depts,
    queryFn: getDeptTree,
    staleTime: 5 * 60 * 1000,
  })
}

/** 角色 CUD Mutations（创建、更新、删除、批量删除、权限保存） */
export const useRoleMutations = (actionRef: RefObject<ActionType | undefined>) => {
  const submit = useMutation({
    mutationFn: ({ record, values }: { record?: Role; values: Record<string, any> }) =>
      record ? updateRole(record.id, values) : createRole(values),
    onSuccess: (_, { record }) => {
      message.success(record ? '更新成功' : '创建成功')
      actionRef.current?.reload()
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
  })

  const batchRemove = useMutation({
    mutationFn: (ids: number[]) => batchDeleteRoles(ids),
    onSuccess: () => {
      message.success('批量删除成功')
      actionRef.current?.reload()
    },
  })

  const savePermission = useMutation({
    mutationFn: ({ roleId, menuIds, deptIds }: { roleId: number; menuIds: number[]; deptIds: number[] }) =>
      updateRolePermission(roleId, { menuIds, deptIds }),
    onSuccess: () => {
      message.success('权限保存成功')
      actionRef.current?.reload()
    },
  })

  return { submit, remove, batchRemove, savePermission }
}
