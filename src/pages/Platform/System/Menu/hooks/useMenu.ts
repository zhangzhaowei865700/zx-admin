import { useMutation, useQuery } from '@tanstack/react-query'
import { message } from 'antd'
import type { ActionType } from '@ant-design/pro-components'
import type { RefObject } from 'react'
import { getMenuTree, createMenu, updateMenu, deleteMenu } from '@/api/modules/platform/system'
import { queryKeys } from '@/hooks/query'

/** 获取菜单树（带缓存，表单选择父级菜单时复用） */
export const useMenuTreeQuery = () => {
  return useQuery({
    queryKey: queryKeys.system.menus,
    queryFn: getMenuTree,
    staleTime: 5 * 60 * 1000,
  })
}

/** 菜单 CUD Mutations */
export const useMenuMutations = (actionRef: RefObject<ActionType | undefined>) => {
  const submit = useMutation({
    mutationFn: ({ id, values }: { id?: number; values: Record<string, any> }) =>
      id ? updateMenu(id, values) : createMenu(values),
    onSuccess: (_, { id }) => {
      message.success(id ? '更新成功' : '创建成功')
      actionRef.current?.reload()
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteMenu(id),
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
  })

  return { submit, remove }
}
