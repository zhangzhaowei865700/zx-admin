import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import type { ActionType } from '@ant-design/pro-components'
import type { RefObject } from 'react'
import { batchDeleteOrders } from '@/api/modules/tenant'

/** 订单 Mutations（批量删除） */
export const useOrderMutations = (
  actionRef: RefObject<ActionType | undefined>,
  onSelectionClear: () => void,
) => {
  const batchRemove = useMutation({
    mutationFn: (ids: number[]) => batchDeleteOrders(ids),
    onSuccess: () => {
      message.success('批量删除成功')
      onSelectionClear()
      actionRef.current?.reload()
    },
  })

  return { batchRemove }
}
