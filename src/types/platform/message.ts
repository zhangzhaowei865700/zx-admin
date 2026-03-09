import type { PageParams } from '../index'

// 消息类型
export type MessageType = 'announcement' | 'notification' | 'message'

// 消息优先级
export type MessagePriority = 'normal' | 'important' | 'urgent'

// 消息
export interface Message {
  id: number
  title: string
  content: string
  type: MessageType
  priority: MessagePriority
  senderId: number
  senderName: string
  senderAvatar?: string
  isRead: boolean
  createdAt: string
}

// 消息列表查询参数
export interface MessageListParams extends PageParams {
  type?: MessageType
  isRead?: number // 0=未读 1=已读
  keyword?: string
}

// 未读数统计
export interface UnreadCount {
  total: number
  announcement: number
  notification: number
  message: number
}
