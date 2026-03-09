import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface UserState {
  token: string | null
  saasName: string
  userInfo: User | null
  permissions: string[]
  setToken: (token: string) => void
  setSaasName: (name: string) => void
  setUserInfo: (info: User) => void
  setPermissions: (permissions: string[]) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      saasName: '',
      userInfo: null,
      permissions: [],
      setToken: (token) => set({ token }),
      setSaasName: (saasName) => set({ saasName }),
      setUserInfo: (userInfo) => set({ userInfo }),
      setPermissions: (permissions) => set({ permissions }),
      logout: () => set({ token: null, saasName: '', userInfo: null, permissions: [] }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ token: state.token, saasName: state.saasName }),
    }
  )
)
