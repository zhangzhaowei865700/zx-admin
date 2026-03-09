import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import type { ActionType } from '@ant-design/pro-components'
import type { RefObject } from 'react'
import { getUnreadCount, markAsRead, markAllAsRead, deleteMessages } from '@/api/modules/platform/message'
import { useMessageStore } from '@/stores'
import { queryKeys } from '@/hooks/query'

/** 未读消息数查询（带缓存，收件箱页面挂载时立即刷新） */
export const useUnreadCountQuery = () => {
  const { setUnreadCount } = useMessageStore()
  return useQuery({
    queryKey: queryKeys.platform.unreadCount,
    queryFn: async () => {
      const count = await getUnreadCount()
      setUnreadCount(count)
      return count
    },
    staleTime: 0, // 每次进入收件箱都刷新
  })
}

/** 消息相关 Mutations（标记已读、全部已读、删除） */
export const useMessageMutations = (
  actionRef: RefObject<ActionType | undefined>,
  onSelectionClear: () => void,
) => {
  const queryClient = useQueryClient()
  const { setUnreadCount } = useMessageStore()

  const refreshUnread = async () => {
    const count = await getUnreadCount()
    setUnreadCount(count)
    queryClient.invalidateQueries({ queryKey: queryKeys.platform.unreadCount })
  }

  const markRead = useMutation({
    mutationFn: (ids: number[]) => markAsRead(ids),
    onSuccess: async () => {
      message.success('标记已读成功')
      onSelectionClear()
      actionRef.current?.reload()
      await refreshUnread()
    },
  })

  const markAllRead = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: async () => {
      message.success('已全部标为已读')
      actionRef.current?.reload()
      await refreshUnread()
    },
  })

  const remove = useMutation({
    mutationFn: (ids: number[]) => deleteMessages(ids),
    onSuccess: async () => {
      message.success('删除成功')
      onSelectionClear()
      actionRef.current?.reload()
      await refreshUnread()
    },
  })

  return { markRead, markAllRead, remove }
}
