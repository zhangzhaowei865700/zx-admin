import request from '@/api/request'
import type { PageResult, Message, MessageListParams, UnreadCount } from '@/types'

// 消息列表
export const getMessageList = (params: MessageListParams) =>
  request<PageResult<Message>>({
    url: '/api/admin/message/list',
    method: 'POST',
    data: params,
  })

// 消息详情
export const getMessageDetail = (id: number) =>
  request<Message>({
    url: `/api/admin/message/${id}`,
    method: 'GET',
  })

// 标记已读（单条/批量）
export const markAsRead = (ids: number[]) =>
  request({
    url: '/api/admin/message/read',
    method: 'POST',
    data: { ids },
  })

// 全部已读
export const markAllAsRead = () =>
  request({
    url: '/api/admin/message/read-all',
    method: 'POST',
  })

// 删除消息（单条/批量）
export const deleteMessages = (ids: number[]) =>
  request({
    url: '/api/admin/message/delete',
    method: 'POST',
    data: { ids },
  })

// 未读数统计
export const getUnreadCount = () =>
  request<UnreadCount>({
    url: '/api/admin/message/unread-count',
    method: 'GET',
  })
