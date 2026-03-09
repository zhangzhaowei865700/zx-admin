import { useUserStore } from '@/stores'

/**
 * 权限判断 hook
 *
 * 规则：
 * - permissions 为空数组时视为拥有全部权限（兼容后端未对接场景）
 * - 支持单个权限码或权限码数组（OR 逻辑，任意一个满足即通过）
 *
 * @example
 * const { hasPermission } = usePermission()
 * hasPermission('tenant:delete')          // 单个
 * hasPermission(['tenant:edit', 'admin']) // 多个（任一满足）
 */
export const usePermission = () => {
  const permissions = useUserStore((state) => state.permissions)

  const hasPermission = (code: string | string[]): boolean => {
    if (permissions.length === 0) return true
    if (Array.isArray(code)) return code.some((c) => permissions.includes(c))
    return permissions.includes(code)
  }

  return { hasPermission, permissions }
}
