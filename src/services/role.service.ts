import type { Menu, Dept } from '@/api/modules/platform/system'

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
export function getAllLeafKeys(treeData: { key: number; children?: any[] }[]): number[] {
  const keys: number[] = []
  const traverse = (nodes: { key: number; children?: any[] }[]) => {
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
