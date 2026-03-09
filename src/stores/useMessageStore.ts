import { create } from 'zustand'
import type { UnreadCount } from '@/types/platform/message'

interface MessageState {
  unreadCount: UnreadCount
  setUnreadCount: (count: UnreadCount) => void
  clearUnread: () => void
}

const DEFAULT_COUNT: UnreadCount = { total: 0, announcement: 0, notification: 0, message: 0 }

export const useMessageStore = create<MessageState>()((set) => ({
  unreadCount: DEFAULT_COUNT,
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  clearUnread: () => set({ unreadCount: DEFAULT_COUNT }),
}))
