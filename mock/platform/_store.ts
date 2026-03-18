/**
 * 平台 Mock 统一数据存储层
 *
 * 所有平台级 mock（auth / system）共享此数据，
 * CRUD 操作直接修改这里的数组，确保登录、用户管理、角色管理读取的数据一致。
 */

// ==================== 类型定义 ====================

export interface StorePlatform {
  id: number
  name: string
  code: string
  description: string
  path: string
}

export interface StoreUser {
  id: number
  username: string
  password: string
  nickname: string
  phone: string
  email: string
  avatar: string
  status: number
  platformIds: number[]
  roleIds: number[]
  createdAt: string
  updatedAt: string
}

export interface StoreRole {
  id: number
  name: string
  code: string
  description: string
  menuIds: number[]
  deptIds: number[]
  status: number
  createdAt: string
  updatedAt: string
}

export interface StoreMenu {
  id: number
  parentId: number
  name: string
  path: string
  icon: string
  component: string
  permission: string
  type: number // 1=目录 2=菜单 3=按钮
  sort: number
  visible: number
  status: number
  children: StoreMenu[]
  createdAt: string
  updatedAt: string
}

export interface StoreDept {
  id: number
  parentId: number
  name: string
  sort: number
  status: number
  children: StoreDept[]
}

// ==================== 平台数据（只读） ====================

export const platforms: StorePlatform[] = [
  { id: 1, name: '六合山庄', code: 'platform', description: '山庄管理后台', path: '/' },
  { id: 2, name: '山悦酒店', code: 'shanyue', description: '酒店管理后台', path: '/' },
  { id: 3, name: '星海民宿', code: 'xinghai', description: '民宿管理后台', path: '/' },
]

// ==================== 菜单树（可变） ====================

const ts = '2024-01-01'
const m = (id: number, parentId: number, name: string, permission: string, type: number, sort: number, opts: Partial<StoreMenu> = {}): StoreMenu => ({
  id, parentId, name, permission, type, sort,
  path: opts.path ?? '', icon: opts.icon ?? '', component: opts.component ?? '',
  visible: 1, status: 1, children: opts.children ?? [],
  createdAt: ts, updatedAt: ts,
})

export let menus: StoreMenu[] = [
  // === 平台级菜单 ===
  m(1, 0, '首页', 'dashboard', 2, 0, { path: '/', icon: 'DashboardOutlined' }),
  m(2, 0, '商户管理', 'tenant', 1, 1, {
    path: '/tenant', icon: 'ShopOutlined',
    children: [
      m(21, 2, '商户列表', 'tenant:list', 2, 0, {
        children: [
          m(211, 21, '查看', 'tenant:list:view', 3, 0),
          m(212, 21, '新增', 'tenant:list:create', 3, 1),
          m(213, 21, '编辑', 'tenant:list:update', 3, 2),
          m(214, 21, '删除', 'tenant:list:delete', 3, 3),
          m(215, 21, '后台', 'tenant:list:backend', 3, 4, {
            children: [
              m(51, 215, '工作台', 'tenant:list:backend:dashboard', 2, 0, { path: 'dashboard', icon: 'DashboardOutlined' }),
              m(52, 215, '订单管理', 'tenant:list:backend:order', 2, 1, {
                path: 'order', icon: 'ShoppingCartOutlined',
                children: [
                  m(521, 52, '查看', 'tenant:list:backend:order:view', 3, 0),
                  m(522, 52, '删除', 'tenant:list:backend:order:delete', 3, 1),
                ],
              }),
              m(53, 215, '商品管理', 'tenant:list:backend:product', 2, 2, {
                path: 'product', icon: 'ShopOutlined',
                children: [
                  m(531, 53, '查看', 'tenant:list:backend:product:view', 3, 0),
                  m(532, 53, '新增', 'tenant:list:backend:product:create', 3, 1),
                  m(533, 53, '编辑', 'tenant:list:backend:product:update', 3, 2),
                  m(534, 53, '删除', 'tenant:list:backend:product:delete', 3, 3),
                ],
              }),
              m(54, 215, '店铺设置', 'tenant:list:backend:setting', 2, 3, {
                path: 'setting', icon: 'SettingOutlined',
                children: [
                  m(541, 54, '查看/编辑', 'tenant:list:backend:setting:view', 3, 0),
                ],
              }),
              m(55, 215, '系统管理', 'tenant:list:backend:system', 1, 4, {
                path: 'system', icon: 'SettingOutlined',
                children: [
                  m(551, 55, '权限概览', 'tenant:list:backend:system:overview', 2, 0, { path: 'system/overview' }),
                  m(552, 55, '用户管理', 'tenant:list:backend:system:user', 2, 1, {
                    path: 'system/user', icon: 'UserOutlined',
                    children: [
                      m(5521, 552, '查看', 'tenant:list:backend:system:user:view', 3, 0),
                      m(5522, 552, '新增', 'tenant:list:backend:system:user:create', 3, 1),
                      m(5523, 552, '编辑', 'tenant:list:backend:system:user:update', 3, 2),
                      m(5524, 552, '删除', 'tenant:list:backend:system:user:delete', 3, 3),
                    ],
                  }),
                  m(553, 55, '角色管理', 'tenant:list:backend:system:role', 2, 2, {
                    path: 'system/role', icon: 'SafetyCertificateOutlined',
                    children: [
                      m(5531, 553, '查看', 'tenant:list:backend:system:role:view', 3, 0),
                      m(5532, 553, '编辑', 'tenant:list:backend:system:role:update', 3, 1),
                      m(5533, 553, '新增', 'tenant:list:backend:system:role:create', 3, 2),
                      m(5534, 553, '删除', 'tenant:list:backend:system:role:delete', 3, 3),
                    ],
                  }),
                  m(554, 55, '菜单管理', 'tenant:list:backend:system:menu', 2, 3, {
                    path: 'system/menu', icon: 'MenuOutlined',
                    children: [
                      m(5541, 554, '查看', 'tenant:list:backend:system:menu:view', 3, 0),
                      m(5542, 554, '编辑', 'tenant:list:backend:system:menu:update', 3, 1),
                      m(5543, 554, '新增', 'tenant:list:backend:system:menu:create', 3, 2),
                      m(5544, 554, '删除', 'tenant:list:backend:system:menu:delete', 3, 3),
                    ],
                  }),
                  m(555, 55, '权限管理', 'tenant:list:backend:system:permission', 2, 4, { path: 'system/permission' }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }),
  m(3, 0, '消息中心', 'message', 2, 2, { path: '/inbox', icon: 'MailOutlined' }),
  m(4, 0, '系统管理', 'system', 1, 3, {
    path: '/system', icon: 'SettingOutlined',
    children: [
      m(41, 4, '用户管理', 'system:user', 2, 0, {
        path: '/system/user', icon: 'UserOutlined',
        children: [
          m(411, 41, '查看', 'system:user:view', 3, 0),
          m(412, 41, '新增', 'system:user:create', 3, 1),
          m(413, 41, '编辑', 'system:user:update', 3, 2),
          m(414, 41, '删除', 'system:user:delete', 3, 3),
          m(415, 41, '重置密码', 'system:user:resetPwd', 3, 4),
        ],
      }),
      m(42, 4, '角色管理', 'system:role', 2, 1, {
        path: '/system/role', icon: 'SafetyCertificateOutlined',
        children: [
          m(421, 42, '查看', 'system:role:view', 3, 0),
          m(422, 42, '新增', 'system:role:create', 3, 1),
          m(423, 42, '编辑', 'system:role:update', 3, 2),
          m(424, 42, '删除', 'system:role:delete', 3, 3),
          m(425, 42, '分配权限', 'system:role:permission', 3, 4),
        ],
      }),
      m(43, 4, '菜单管理', 'system:menu', 2, 2, {
        path: '/system/menu', icon: 'MenuOutlined',
        children: [
          m(431, 43, '查看', 'system:menu:view', 3, 0),
          m(432, 43, '新增', 'system:menu:create', 3, 1),
          m(433, 43, '编辑', 'system:menu:update', 3, 2),
          m(434, 43, '删除', 'system:menu:delete', 3, 3),
        ],
      }),
    ],
  }),
]

// ==================== 部门树（只读） ====================

export const depts: StoreDept[] = [
  { id: 1, parentId: 0, name: '总公司', sort: 0, status: 1, children: [
    { id: 2, parentId: 1, name: '研发部', sort: 1, status: 1, children: [] },
    { id: 3, parentId: 1, name: '运营部', sort: 2, status: 1, children: [] },
    { id: 4, parentId: 1, name: '财务部', sort: 3, status: 1, children: [] },
  ]},
  { id: 5, parentId: 0, name: '分公司A', sort: 1, status: 1, children: [
    { id: 6, parentId: 5, name: '销售部', sort: 1, status: 1, children: [] },
    { id: 7, parentId: 5, name: '市场部', sort: 2, status: 1, children: [] },
  ]},
]

// ==================== 角色数据（可变） ====================

/** 收集菜单树中所有 ID */
function collectAllMenuIds(items: StoreMenu[]): number[] {
  const ids: number[] = []
  for (const item of items) {
    ids.push(item.id)
    if (item.children.length) ids.push(...collectAllMenuIds(item.children))
  }
  return ids
}

const allMenuIds = collectAllMenuIds(menus)

// operator 拥有的菜单 ID：平台基础（首页、商户管理可查看/新增/编辑、消息中心）+ 后台业务（无删除、无系统管理）
const operatorMenuIds = [
  1,                                      // 首页
  2, 21, 211, 212, 213, 215,              // 商户管理（查看/新增/编辑，进入后台，无删除）
  3,                                      // 消息中心
  51,                                     // 后台：工作台
  52, 521, 522,                           // 后台：订单管理（查看/删除）
  53, 531, 532, 533,                      // 后台：商品管理（查看/新增/编辑）
  54, 541,                                // 后台：店铺设置（查看/编辑）
  55,                                     // 后台：系统管理（目录）
  551,                                    // 后台：权限概览
  552, 5521, 5522, 5523,                  // 后台：用户管理（查看/新增/编辑）
  553, 5531, 5532, 5533,                  // 后台：角色管理（查看/编辑/新增）
  554, 5541, 5542,                        // 后台：菜单管理（查看/编辑）
  555,                                    // 后台：权限管理
]

// viewer 拥有的菜单 ID：仅平台基础查看 + 后台查看
const viewerMenuIds = [
  1,                                      // 首页
  2, 21, 211, 215,                        // 商户管理（仅查看，可进入后台）
  3,                                      // 消息中心
  51,                                     // 后台：工作台
  52, 521,                                // 后台：订单管理（仅查看）
  53, 531,                                // 后台：商品管理（仅查看）
  54, 541,                                // 后台：店铺设置（仅查看）
]

export let roles: StoreRole[] = [
  { id: 1, name: '超级管理员', code: 'super_admin', description: '拥有所有权限', menuIds: allMenuIds, deptIds: [1, 2, 3, 4, 5, 6, 7], status: 1, createdAt: ts, updatedAt: ts },
  { id: 2, name: '运营管理员', code: 'operator', description: '负责日常运营管理', menuIds: operatorMenuIds, deptIds: [1, 2, 3], status: 1, createdAt: ts, updatedAt: ts },
  { id: 3, name: '普通用户', code: 'viewer', description: '基础查看权限', menuIds: viewerMenuIds, deptIds: [1], status: 1, createdAt: ts, updatedAt: ts },
]

// ==================== 用户数据（可变） ====================

export let users: StoreUser[] = [
  { id: 1, username: 'admin', password: 'zx@123', nickname: '超级管理员', phone: '13800000001', email: 'admin@test.com', avatar: '', status: 1, platformIds: [1, 2, 3], roleIds: [1], createdAt: ts, updatedAt: ts },
  { id: 2, username: 'operator', password: 'zx@123', nickname: '运营主管', phone: '13800000002', email: 'operator@test.com', avatar: '', status: 1, platformIds: [1, 2], roleIds: [2], createdAt: ts, updatedAt: ts },
  { id: 3, username: 'viewer', password: 'zx@123', nickname: '只读用户', phone: '13800000003', email: 'viewer@test.com', avatar: '', status: 1, platformIds: [1], roleIds: [3], createdAt: ts, updatedAt: ts },
  { id: 4, username: 'zhangsan', password: 'zx@123', nickname: '张三', phone: '13800000004', email: 'zhangsan@test.com', avatar: '', status: 1, platformIds: [1, 2], roleIds: [2], createdAt: '2024-01-05', updatedAt: '2024-01-05' },
  { id: 5, username: 'lisi', password: 'zx@123', nickname: '李四', phone: '13800000005', email: 'lisi@test.com', avatar: '', status: 0, platformIds: [1], roleIds: [3], createdAt: '2024-02-10', updatedAt: '2024-02-10' },
]

// ==================== 工具函数 ====================

/** 从数组中取下一个自增 ID */
export function nextId(items: { id: number }[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map((i) => i.id)) + 1
}

/** 从树形结构中递归取最大 ID + 1 */
export function nextIdFromTree(items: StoreMenu[]): number {
  let max = 0
  for (const item of items) {
    if (item.id > max) max = item.id
    if (item.children.length) {
      const childMax = nextIdFromTree(item.children) - 1
      if (childMax > max) max = childMax
    }
  }
  return max + 1
}

/** 收集指定菜单 ID 列表对应的所有 permission 字符串 */
export function collectPermissionsByMenuIds(menuIds: number[]): string[] {
  const permissions = new Set<string>()
  const idSet = new Set(menuIds)
  const walk = (items: StoreMenu[]) => {
    for (const item of items) {
      if (idSet.has(item.id) && item.permission) {
        permissions.add(item.permission)
      }
      if (item.children.length) walk(item.children)
    }
  }
  walk(menus)
  return [...permissions]
}

/** 根据用户的 roleIds 计算该用户的权限字符串列表 */
export function computeUserPermissions(user: StoreUser): string[] {
  const menuIdSet = new Set<number>()
  for (const roleId of user.roleIds) {
    const role = roles.find((r) => r.id === roleId)
    if (role && role.status === 1) {
      for (const mid of role.menuIds) menuIdSet.add(mid)
    }
  }
  return collectPermissionsByMenuIds([...menuIdSet])
}

/** 根据 roleIds 获取角色名称列表 */
export function hydrateRoleNames(roleIds: number[]): string[] {
  return roleIds
    .map((id) => roles.find((r) => r.id === id)?.name)
    .filter(Boolean) as string[]
}

/** 递归查找菜单 */
export function findMenuInTree(items: StoreMenu[], id: number): StoreMenu | undefined {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children.length) {
      const found = findMenuInTree(item.children, id)
      if (found) return found
    }
  }
  return undefined
}

/** 递归在树中插入菜单到指定 parentId 下 */
export function insertMenuInTree(items: StoreMenu[], parentId: number, newMenu: StoreMenu): boolean {
  for (const item of items) {
    if (item.id === parentId) {
      item.children.push(newMenu)
      return true
    }
    if (item.children.length && insertMenuInTree(item.children, parentId, newMenu)) return true
  }
  return false
}

/** 递归更新菜单 */
export function updateMenuInTree(items: StoreMenu[], id: number, data: Partial<StoreMenu>): boolean {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      items[i] = { ...items[i], ...data, children: items[i].children }
      return true
    }
    if (items[i].children.length && updateMenuInTree(items[i].children, id, data)) return true
  }
  return false
}

/** 递归删除菜单 */
export function deleteMenuFromTree(items: StoreMenu[], id: number): boolean {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      items.splice(i, 1)
      return true
    }
    if (items[i].children.length && deleteMenuFromTree(items[i].children, id)) return true
  }
  return false
}
