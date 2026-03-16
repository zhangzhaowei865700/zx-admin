import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface UserState {
  token: string | null
  saasName: string
  userInfo: User | null
  permissions: string[]
  _hasHydrated: boolean
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
      _hasHydrated: false,
      setToken: (token) => set({ token }),
      setSaasName: (saasName) => set({ saasName }),
      setUserInfo: (userInfo) => set({ userInfo }),
      setPermissions: (permissions) => set({ permissions }),
      logout: () => set({ token: null, saasName: '', userInfo: null, permissions: [] }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        token: state.token,
        saasName: state.saasName,
        permissions: state.permissions,
      }),
      onRehydrateStorage: () => (state) => {
        // 无论恢复成功还是失败，都标记水合完成，避免 Guard 永久空白
        if (state) {
          state._hasHydrated = true
        } else {
          useUserStore.setState({ _hasHydrated: true })
        }
      },
    }
  )
)
