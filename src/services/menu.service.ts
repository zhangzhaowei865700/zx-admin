import type { Menu } from '@/types'

/** 递归在菜单树中按 id 查找节点 */
export function findMenuById(menus: Menu[], targetId: number): Menu | undefined {
  for (const menu of menus) {
    if (menu.id === targetId) return menu
    if (menu.children) {
      const found = findMenuById(menu.children, targetId)
      if (found) return found
    }
  }
  return undefined
}

/** 将菜单树转换为 TreeSelect 组件所需的数据结构 */
export function convertToTreeSelectData(menus: Menu[]): { title: string; value: number; children: any[] }[] {
  return menus.map((menu) => ({
    title: menu.name,
    value: menu.id,
    children: menu.children ? convertToTreeSelectData(menu.children) : [],
  }))
}

/**
 * 根据 parentId 计算权限前缀
 * 父菜单存在 permission 时，前缀为 "parentPermission:"，否则为空字符串
 */
export function buildPermissionPrefix(menus: Menu[], parentId?: number): string {
  if (!parentId) return ''
  const parentMenu = findMenuById(menus, parentId)
  return parentMenu?.permission ? `${parentMenu.permission}:` : ''
}

/**
 * 去除权限字段中的前缀部分
 * 编辑时用于将完整权限值还原为不含前缀的输入值，以便在表单中展示
 */
export function stripPermissionPrefix(permission: string | undefined, prefix: string): string | undefined {
  if (!permission || !prefix) return permission
  return permission.startsWith(prefix) ? permission.slice(prefix.length) : permission
}

/**
 * 构造提交给后端的权限字段值
 * 如果存在前缀，则拼接前缀 + 用户输入的权限码
 */
export function buildPermissionValue(inputValue: string | undefined, prefix: string): string | undefined {
  if (!prefix || !inputValue) return inputValue
  return `${prefix}${inputValue}`
}

type PermissionMenuItem<T extends PermissionMenuItem<T>> = {
  permission?: string
  children?: T[]
}

/** 按权限递归过滤菜单，空权限列表保持全量（兼容后端未对接场景） */
export function filterMenuByPermissions<T extends PermissionMenuItem<T>>(menus: T[], permissions: string[]): T[] {
  if (permissions.length === 0) return menus

  return menus
    .map((menu) => {
      const nextChildren = menu.children ? filterMenuByPermissions(menu.children, permissions) : undefined
      const hasChildren = !!menu.children && menu.children.length > 0
      const hasVisibleChildren = !!nextChildren && nextChildren.length > 0
      const selfAllowed = !menu.permission || permissions.includes(menu.permission)

      // Parent containers without explicit permission should only be visible
      // when they still have visible children after filtering.
      if (hasChildren && !menu.permission) {
        if (!hasVisibleChildren) return null
      } else if (!selfAllowed && !hasVisibleChildren) {
        return null
      }

      return {
        ...menu,
        ...(nextChildren ? { children: nextChildren } : {}),
      }
    })
    .filter(Boolean) as T[]
}
