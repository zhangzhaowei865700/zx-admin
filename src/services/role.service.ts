import type React from 'react'
import type { Menu, Dept } from '@/types'

function convertAllMenus(items: Menu[]): { title: string; key: number; children: any[] }[] {
  return items.map((menu) => ({
    title: menu.name,
    key: menu.id,
    children: menu.children ? convertAllMenus(menu.children) : [],
  }))
}

/** 将菜单树转换为 Ant Design Tree 组件数据结构，支持搜索过滤 */
export function convertMenuToTreeData(menus: Menu[], search = ''): { title: string; key: number; children: any[] }[] {
  if (!search) return convertAllMenus(menus)

  const filter = (items: Menu[]): any[] => {
    const result: any[] = []
    for (const menu of items) {
      if (menu.name.toLowerCase().includes(search.toLowerCase())) {
        // 自身匹配：保留并展示完整子树
        result.push({ title: menu.name, key: menu.id, children: menu.children ? convertAllMenus(menu.children) : [] })
      } else {
        // 自身不匹配：检查子节点，有匹配才保留父节点
        const filteredChildren = menu.children ? filter(menu.children) : []
        if (filteredChildren.length > 0) {
          result.push({ title: menu.name, key: menu.id, children: filteredChildren })
        }
      }
    }
    return result
  }

  return filter(menus)
}

function convertAllDepts(items: Dept[]): { title: string; key: number; children: any[] }[] {
  return items.map((dept) => ({
    title: dept.name,
    key: dept.id,
    children: dept.children ? convertAllDepts(dept.children) : [],
  }))
}

/** 将部门树转换为 Ant Design Tree 组件数据结构，支持搜索过滤 */
export function convertDeptToTreeData(depts: Dept[], search = ''): { title: string; key: number; children: any[] }[] {
  if (!search) return convertAllDepts(depts)

  const filter = (items: Dept[]): any[] => {
    const result: any[] = []
    for (const dept of items) {
      if (dept.name.toLowerCase().includes(search.toLowerCase())) {
        result.push({ title: dept.name, key: dept.id, children: dept.children ? convertAllDepts(dept.children) : [] })
      } else {
        const filteredChildren = dept.children ? filter(dept.children) : []
        if (filteredChildren.length > 0) {
          result.push({ title: dept.name, key: dept.id, children: filteredChildren })
        }
      }
    }
    return result
  }

  return filter(depts)
}

/** 递归获取树中所有叶子节点的 key */
export function getAllLeafKeys(treeData: { key: React.Key; children?: any[] }[]): React.Key[] {
  const keys: React.Key[] = []
  const traverse = (nodes: { key: React.Key; children?: any[] }[]) => {
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      } else {
        keys.push(node.key)
      }
    })
  }
  traverse(treeData)
  return keys
}

/** 过滤树数据，只保留 checkedKeys 中的叶子节点及其祖先节点 */
export function filterTreeByCheckedKeys(
  treeData: { title: string; key: number; children: any[] }[],
  checkedKeys: Set<number>,
): { title: string; key: number; children: any[] }[] {
  const result: { title: string; key: number; children: any[] }[] = []
  for (const node of treeData) {
    if (node.children && node.children.length > 0) {
      const filteredChildren = filterTreeByCheckedKeys(node.children, checkedKeys)
      if (filteredChildren.length > 0) {
        result.push({ ...node, children: filteredChildren })
      }
    } else if (checkedKeys.has(node.key)) {
      result.push({ ...node })
    }
  }
  return result
}

/** 递归获取树中所有节点的 key（含父节点） */
export function getAllTreeKeys(treeData: { key: number; children?: any[] }[]): number[] {
  const keys: number[] = []
  const traverse = (nodes: { key: number; children?: any[] }[]) => {
    nodes.forEach((node) => {
      keys.push(node.key)
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    })
  }
  traverse(treeData)
  return keys
}

/** 从 keys 中过滤出仅属于叶子节点的 key（用于回显时排除父级，让 Tree 自动计算半选状态） */
export function filterToLeafKeys(treeData: { key: React.Key; children?: any[] }[], keys: number[]): number[] {
  const leafKeySet = new Set(getAllLeafKeys(treeData))
  return keys.filter((k) => leafKeySet.has(k))
}

/** 从 keys 中分离出叶子节点和非叶子节点（用于加载时拆分 checkedKeys 和 halfCheckedKeys） */
export function splitLeafAndParentKeys(treeData: { key: React.Key; children?: any[] }[], keys: number[]): { leafKeys: number[]; parentKeys: number[] } {
  const leafKeySet = new Set(getAllLeafKeys(treeData))
  const leafKeys: number[] = []
  const parentKeys: number[] = []
  for (const k of keys) {
    if (leafKeySet.has(k)) {
      leafKeys.push(k)
    } else {
      parentKeys.push(k)
    }
  }
  return { leafKeys, parentKeys }
}
