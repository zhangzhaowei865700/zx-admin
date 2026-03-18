import type { RouteObject } from 'react-router-dom'
import type { ReactNode, LazyExoticComponent, ComponentType } from 'react'
import { createElement } from 'react'
import { Navigate } from 'react-router-dom'

/**
 * 统一路由配置类型
 * 同时定义路由和菜单，避免重复配置
 */
export interface AppRouteConfig {
  /** 路由路径 */
  path?: string
  /** 是否为索引路由 */
  index?: boolean
  /** 重定向目标（用于 index 路由的跳转，不显示在菜单中） */
  redirectTo?: string
  /** 懒加载的组件 */
  component?: LazyExoticComponent<ComponentType<any>>
  /** 菜单名称（支持 i18n key） */
  name?: string
  /** 菜单图标 */
  icon?: ReactNode
  /** 权限标识（用于路由守卫和菜单过滤） */
  permission?: string
  /** 菜单分组（仅平台级使用） */
  group?: string
  /** 子路由/子菜单 */
  children?: AppRouteConfig[]
  /** 是否在菜单中隐藏 */
  hideInMenu?: boolean
}

/**
 * 菜单项类型（从路由配置提取）
 */
export interface MenuItem {
  path: string
  icon: ReactNode
  name: string
  permission?: string
  group?: string
  children?: MenuItem[]
}

/**
 * 从统一配置生成 React Router 路由对象
 */
export function generateRoutes(configs: AppRouteConfig[]): RouteObject[] {
  return configs.map((config) => {
    // 重定向路由（index 跳转）
    if (config.redirectTo) {
      return {
        index: true,
        element: createElement(Navigate, { to: config.redirectTo, replace: true }),
      } as RouteObject
    }

    // index 和 path 互斥，分别构造
    if (config.index) {
      const route: RouteObject = {
        index: true,
      }

      if (config.component) {
        route.element = createElement(config.component)
      }

      if (config.permission) {
        route.handle = { permission: config.permission }
      }

      return route
    }

    const route: RouteObject = {}

    if (config.path !== undefined) {
      route.path = config.path
    }

    if (config.component) {
      route.element = createElement(config.component)
    }

    if (config.permission) {
      route.handle = { permission: config.permission }
    }

    if (config.children && config.children.length > 0) {
      route.children = generateRoutes(config.children)
    }

    return route
  })
}

/**
 * 从统一配置提取菜单项（过滤掉 hideInMenu 和 redirectTo 的项）
 * parentPath 用于将相对路径子项拼接为完整路径，解决标签页标签查找问题
 */
export function generateMenuItems(configs: AppRouteConfig[], parentPath?: string): MenuItem[] {
  return configs
    .filter((config) => !config.hideInMenu && config.name && !config.redirectTo)
    .map((config) => {
      // 计算完整路径：绝对路径直接使用，相对路径拼接父路径
      const ownPath = config.path || ''
      const path = ownPath.startsWith('/')
        ? ownPath
        : parentPath && ownPath
          ? `${parentPath}/${ownPath}`
          : ownPath

      const menuItem: MenuItem = {
        path,
        icon: config.icon || null,
        name: config.name!,
        permission: config.permission,
        group: config.group,
      }

      if (config.children && config.children.length > 0) {
        const childMenuItems = generateMenuItems(config.children, path)
        if (childMenuItems.length > 0) {
          menuItem.children = childMenuItems
        }
      }

      return menuItem
    })
}

/**
 * 根据路径查找菜单名称（递归搜索）
 */
export function getMenuLabelByPath(menuItems: MenuItem[], path: string): string {
  for (const item of menuItems) {
    if (item.path === path) return item.name
    if (item.children) {
      const child = item.children.find((c) => c.path === path)
      if (child) return child.name
      // 递归查找深层子菜单
      const deepLabel = getMenuLabelByPath(item.children, path)
      if (deepLabel !== path) return deepLabel
    }
  }
  return path
}
