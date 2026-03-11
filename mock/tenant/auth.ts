type ClientType = 'admin' | 'miniapp'
type DataScopeType = 'self' | 'dept' | 'dept_and_sub' | 'custom' | 'all'

interface RoleRecord {
  id: number
  name: string
  code: string
  status: number
  description?: string
  adminMenuIds: number[]
  miniappMenuIds: number[]
  adminDeptIds: number[]
  miniappDeptIds: number[]
  createdAt: string
}

interface UserRecord {
  id: number
  username: string
  nickname: string
  status: number
  roleIds: number[]
  roleNames: string[]
  enabledClients: ClientType[]
  dataScopes: Record<ClientType, DataScopeType>
  createdAt: string
}

interface MenuRecord {
  id: number
  parentId: number
  name: string
  path?: string
  icon?: string
  component?: string
  permission?: string
  clientType: ClientType
  type: number
  sort: number
  visible: number
  status: number
  children?: MenuRecord[]
  createdAt: string
}

interface DeptRecord {
  id: number
  parentId: number
  name: string
  sort: number
  status: number
  children?: DeptRecord[]
}

const now = () => new Date().toISOString().slice(0, 19).replace('T', ' ')

// ==================== 后台端菜单树 ====================
let adminMenuData: MenuRecord[] = [
  {
    id: 1, parentId: 0, name: '工作台', path: '/dashboard', icon: 'DashboardOutlined', component: 'pages/dashboard/index',
    permission: 'dashboard:view', clientType: 'admin', type: 2, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
  },
  {
    id: 2, parentId: 0, name: '订单管理', path: '/order', icon: 'ShoppingCartOutlined', clientType: 'admin',
    permission: 'order', type: 1, sort: 2, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
    children: [
      { id: 21, parentId: 2, name: '订单列表', path: '/order/list', component: 'pages/order/index', permission: 'order:view', clientType: 'admin', type: 2, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
        children: [
          { id: 211, parentId: 21, name: '新增订单', permission: 'order:create', clientType: 'admin', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
          { id: 212, parentId: 21, name: '编辑订单', permission: 'order:update', clientType: 'admin', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
          { id: 213, parentId: 21, name: '删除订单', permission: 'order:delete', clientType: 'admin', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
        ],
      },
    ],
  },
  {
    id: 3, parentId: 0, name: '商品管理', path: '/product', icon: 'ShopOutlined', clientType: 'admin',
    permission: 'product', type: 1, sort: 3, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
    children: [
      { id: 31, parentId: 3, name: '商品列表', path: '/product/list', component: 'pages/product/index', permission: 'product:view', clientType: 'admin', type: 2, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
        children: [
          { id: 311, parentId: 31, name: '新增商品', permission: 'product:create', clientType: 'admin', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
          { id: 312, parentId: 31, name: '编辑商品', permission: 'product:update', clientType: 'admin', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
          { id: 313, parentId: 31, name: '删除商品', permission: 'product:delete', clientType: 'admin', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
        ],
      },
    ],
  },
  {
    id: 4, parentId: 0, name: '店铺设置', path: '/setting', icon: 'SettingOutlined', component: 'pages/setting/index',
    permission: 'setting:view', clientType: 'admin', type: 2, sort: 4, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
    children: [
      { id: 41, parentId: 4, name: '修改设置', permission: 'setting:update', clientType: 'admin', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
    ],
  },
  {
    id: 5, parentId: 0, name: '系统管理', path: '/system', icon: 'SettingOutlined', clientType: 'admin',
    permission: 'auth', type: 1, sort: 5, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
    children: [
      { id: 51, parentId: 5, name: '用户管理', path: '/system/user', icon: 'UserOutlined', component: 'pages/system/user', permission: 'auth:user', clientType: 'admin', type: 2, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
        children: [
          { id: 511, parentId: 51, name: '新增用户', permission: 'auth:user:create', clientType: 'admin', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
          { id: 512, parentId: 51, name: '编辑用户', permission: 'auth:user:update', clientType: 'admin', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
          { id: 513, parentId: 51, name: '删除用户', permission: 'auth:user:delete', clientType: 'admin', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
        ],
      },
      { id: 52, parentId: 5, name: '角色管理', path: '/system/role', icon: 'SafetyCertificateOutlined', component: 'pages/system/role', permission: 'auth:role', clientType: 'admin', type: 2, sort: 2, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
        children: [
          { id: 521, parentId: 52, name: '新增角色', permission: 'auth:role:create', clientType: 'admin', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
          { id: 522, parentId: 52, name: '编辑角色', permission: 'auth:role:update', clientType: 'admin', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
          { id: 523, parentId: 52, name: '删除角色', permission: 'auth:role:delete', clientType: 'admin', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
        ],
      },
      { id: 53, parentId: 5, name: '菜单管理', path: '/system/menu', icon: 'MenuOutlined', component: 'pages/system/menu', permission: 'auth:menu', clientType: 'admin', type: 2, sort: 3, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
        children: [
          { id: 531, parentId: 53, name: '新增菜单', permission: 'auth:menu:create', clientType: 'admin', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
          { id: 532, parentId: 53, name: '编辑菜单', permission: 'auth:menu:update', clientType: 'admin', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
          { id: 533, parentId: 53, name: '删除菜单', permission: 'auth:menu:delete', clientType: 'admin', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
        ],
      },
    ],
  },
]

// ==================== 小程序端菜单树 ====================
let miniappMenuData: MenuRecord[] = [
  {
    id: 101, parentId: 0, name: '首页', path: '/pages/index/index', icon: 'HomeOutlined',
    permission: 'home:view', clientType: 'miniapp', type: 2, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
  },
  {
    id: 102, parentId: 0, name: '订单', path: '/pages/order', icon: 'ProfileOutlined', clientType: 'miniapp',
    permission: 'order', type: 1, sort: 2, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
    children: [
      { id: 1021, parentId: 102, name: '订单列表', path: '/pages/order/list', permission: 'order:view', clientType: 'miniapp', type: 2, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
      { id: 1022, parentId: 102, name: '更新订单', permission: 'order:update', clientType: 'miniapp', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
    ],
  },
  {
    id: 103, parentId: 0, name: '商品', path: '/pages/product', icon: 'AppstoreOutlined', clientType: 'miniapp',
    permission: 'product', type: 1, sort: 3, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00',
    children: [
      { id: 1031, parentId: 103, name: '商品列表', path: '/pages/product/list', permission: 'product:view', clientType: 'miniapp', type: 2, sort: 1, visible: 1, status: 1, createdAt: '2025-01-01 10:00:00' },
    ],
  },
]

// ==================== 后台端部门树 ====================
const adminDeptData: DeptRecord[] = [
  {
    id: 1, parentId: 0, name: '总部', sort: 1, status: 1,
    children: [
      { id: 11, parentId: 1, name: '运营部', sort: 1, status: 1 },
      { id: 12, parentId: 1, name: '技术部', sort: 2, status: 1 },
      {
        id: 13, parentId: 1, name: '门店管理部', sort: 3, status: 1,
        children: [
          { id: 131, parentId: 13, name: '门店A', sort: 1, status: 1 },
          { id: 132, parentId: 13, name: '门店B', sort: 2, status: 1 },
          { id: 133, parentId: 13, name: '门店C', sort: 3, status: 1 },
        ],
      },
    ],
  },
]

// ==================== 小程序端部门树 ====================
const miniappDeptData: DeptRecord[] = [
  {
    id: 201, parentId: 0, name: '总部', sort: 1, status: 1,
    children: [
      { id: 211, parentId: 201, name: '门店A', sort: 1, status: 1 },
      { id: 212, parentId: 201, name: '门店B', sort: 2, status: 1 },
    ],
  },
]

// ==================== 角色数据 ====================
// 收集所有 admin 菜单 ID
function collectMenuIds(menus: MenuRecord[]): number[] {
  const ids: number[] = []
  for (const m of menus) {
    ids.push(m.id)
    if (m.children) ids.push(...collectMenuIds(m.children))
  }
  return ids
}

const allAdminMenuIds = collectMenuIds(adminMenuData)
const allMiniappMenuIds = collectMenuIds(miniappMenuData)

let roleData: RoleRecord[] = [
  {
    id: 1,
    name: '租户超级管理员',
    code: 'tenant_super_admin',
    status: 1,
    description: '租户后台与小程序全权限',
    adminMenuIds: allAdminMenuIds,
    miniappMenuIds: allMiniappMenuIds,
    adminDeptIds: [1, 11, 12, 13, 131, 132, 133],
    miniappDeptIds: [201, 211, 212],
    createdAt: '2025-01-01 10:00:00',
  },
  {
    id: 2,
    name: '门店经理',
    code: 'store_manager',
    status: 1,
    description: '门店业务管理',
    adminMenuIds: [1, 2, 21, 3, 31, 4, 41],
    miniappMenuIds: [101, 102, 1021],
    adminDeptIds: [13, 131],
    miniappDeptIds: [211],
    createdAt: '2025-01-08 10:00:00',
  },
]

// ==================== 用户数据 ====================
let userData: UserRecord[] = [
  {
    id: 1,
    username: 'tenant_admin',
    nickname: '租户管理员',
    status: 1,
    roleIds: [1],
    roleNames: ['租户超级管理员'],
    enabledClients: ['admin', 'miniapp'],
    dataScopes: { admin: 'all', miniapp: 'all' },
    createdAt: '2025-01-03 09:00:00',
  },
  {
    id: 2,
    username: 'store_lead',
    nickname: '门店负责人',
    status: 1,
    roleIds: [2],
    roleNames: ['门店经理'],
    enabledClients: ['admin', 'miniapp'],
    dataScopes: { admin: 'dept_and_sub', miniapp: 'dept' },
    createdAt: '2025-01-10 09:00:00',
  },
]

// ==================== 工具函数 ====================
const nextId = (items: Array<{ id: number }>) => (items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1)

function nextIdFromTree(items: MenuRecord[]): number {
  let maxId = 0
  for (const item of items) {
    if (item.id > maxId) maxId = item.id
    if (item.children) {
      const childMax = nextIdFromTree(item.children)
      if (childMax > maxId) maxId = childMax
    }
  }
  return maxId + 1
}

const toPaged = <T>(list: T[], pageNum: number, pageSize: number) => {
  const start = (pageNum - 1) * pageSize
  return { list: list.slice(start, start + pageSize), total: list.length }
}

const byKeyword = (value: string, keyword?: string) => !keyword || value.toLowerCase().includes(keyword.toLowerCase())

const hydrateRoleNames = (roleIds: number[]) =>
  roleData.filter((r) => roleIds.includes(r.id)).map((r) => r.name)

function findAndInsertMenu(menus: MenuRecord[], parentId: number, newMenu: MenuRecord): boolean {
  for (const menu of menus) {
    if (menu.id === parentId) {
      if (!menu.children) menu.children = []
      menu.children.push(newMenu)
      return true
    }
    if (menu.children && findAndInsertMenu(menu.children, parentId, newMenu)) return true
  }
  return false
}

function updateMenuInTree(menus: MenuRecord[], id: number, data: Partial<MenuRecord>): boolean {
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].id === id) {
      menus[i] = { ...menus[i], ...data, id: menus[i].id, children: menus[i].children }
      return true
    }
    if (menus[i].children && updateMenuInTree(menus[i].children!, id, data)) return true
  }
  return false
}

function deleteMenuFromTree(menus: MenuRecord[], id: number): boolean {
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].id === id) {
      menus.splice(i, 1)
      return true
    }
    if (menus[i].children && deleteMenuFromTree(menus[i].children!, id)) return true
  }
  return false
}

function getMenuDataByClientType(clientType: ClientType): MenuRecord[] {
  return clientType === 'admin' ? adminMenuData : miniappMenuData
}

export default [
  // ==================== 用户 ====================
  {
    url: '/api/tenant/auth/user/list',
    method: 'POST',
    response: ({ body }: { body: Record<string, any> }) => {
      const pageNum = Number(body?.pageNum) || 1
      const pageSize = Number(body?.pageSize) || 10
      const keyword = String(body?.keyword || '').trim()
      const status = body?.status === '' || body?.status === undefined ? undefined : Number(body.status)

      const filtered = userData.filter((item) => {
        if (!(byKeyword(item.username, keyword) || byKeyword(item.nickname, keyword) || item.roleNames.some((r) => byKeyword(r, keyword)))) return false
        if (status !== undefined && item.status !== status) return false
        return true
      })

      return { code: 200, data: toPaged(filtered, pageNum, pageSize), msg: 'success' }
    },
  },
  {
    url: '/api/tenant/auth/user',
    method: 'POST',
    response: ({ body }: { body: Partial<UserRecord> }) => {
      const id = nextId(userData)
      const roleIds = body.roleIds || []
      const item: UserRecord = {
        id,
        username: String(body.username || `user_${id}`),
        nickname: String(body.nickname || `用户${id}`),
        status: body.status === 0 ? 0 : 1,
        roleIds,
        roleNames: hydrateRoleNames(roleIds),
        enabledClients: (body.enabledClients || ['admin']) as ClientType[],
        dataScopes: (body.dataScopes || { admin: 'self', miniapp: 'self' }) as Record<ClientType, DataScopeType>,
        createdAt: now(),
      }
      userData.unshift(item)
      return { code: 200, data: { id }, msg: '新增用户成功' }
    },
  },
  {
    url: '/api/tenant/auth/user/:id',
    method: 'PUT',
    response: ({ params, body }: { params: Record<string, string>; body: Partial<UserRecord> }) => {
      const id = Number(params?.id)
      userData = userData.map((item) => {
        if (item.id !== id) return item
        const roleIds = body.roleIds ?? item.roleIds
        return {
          ...item,
          ...body,
          roleIds,
          roleNames: hydrateRoleNames(roleIds),
          dataScopes: { ...item.dataScopes, ...(body.dataScopes || {}) },
        }
      })
      return { code: 200, data: null, msg: '更新用户成功' }
    },
  },
  {
    url: '/api/tenant/auth/user/:id',
    method: 'DELETE',
    response: ({ params }: { params: Record<string, string> }) => {
      const id = Number(params?.id)
      userData = userData.filter((item) => item.id !== id)
      return { code: 200, data: null, msg: '删除用户成功' }
    },
  },

  // ==================== 角色 ====================
  {
    url: '/api/tenant/auth/role/list',
    method: 'POST',
    response: ({ body }: { body: Record<string, any> }) => {
      const pageNum = Number(body?.pageNum) || 1
      const pageSize = Number(body?.pageSize) || 10
      const keyword = String(body?.keyword || '').trim()
      const status = body?.status === '' || body?.status === undefined ? undefined : Number(body.status)

      const filtered = roleData.filter((item) => {
        if (!(byKeyword(item.name, keyword) || byKeyword(item.code, keyword))) return false
        if (status !== undefined && item.status !== status) return false
        return true
      })

      return { code: 200, data: toPaged(filtered, pageNum, pageSize), msg: 'success' }
    },
  },
  {
    url: '/api/tenant/auth/role/all',
    method: 'GET',
    response: () => ({ code: 200, data: roleData, msg: 'success' }),
  },
  {
    url: '/api/tenant/auth/role/batch',
    method: 'DELETE',
    response: ({ body }: { body: { ids: number[] } }) => {
      const ids = body.ids || []
      roleData = roleData.filter((item) => !ids.includes(item.id))
      userData = userData.map((user) => {
        const roleIds = user.roleIds.filter((roleId) => !ids.includes(roleId))
        return { ...user, roleIds, roleNames: hydrateRoleNames(roleIds) }
      })
      return { code: 200, data: null, msg: '批量删除角色成功' }
    },
  },
  {
    url: '/api/tenant/auth/role/:id/permission',
    method: 'PUT',
    response: ({ params, body }: { params: Record<string, string>; body: { clientType: ClientType; menuIds: number[]; deptIds: number[] } }) => {
      const id = Number(params?.id)
      roleData = roleData.map((item) => {
        if (item.id !== id) return item
        if (body.clientType === 'admin') {
          return { ...item, adminMenuIds: body.menuIds, adminDeptIds: body.deptIds }
        }
        return { ...item, miniappMenuIds: body.menuIds, miniappDeptIds: body.deptIds }
      })
      return { code: 200, data: null, msg: '权限保存成功' }
    },
  },
  {
    url: '/api/tenant/auth/role',
    method: 'POST',
    response: ({ body }: { body: Partial<RoleRecord> }) => {
      const id = nextId(roleData)
      roleData.unshift({
        id,
        name: String(body.name || `角色${id}`),
        code: String(body.code || `role_${id}`),
        status: body.status === 0 ? 0 : 1,
        description: String(body.description || ''),
        adminMenuIds: [],
        miniappMenuIds: [],
        adminDeptIds: [],
        miniappDeptIds: [],
        createdAt: now(),
      })
      return { code: 200, data: { id }, msg: '新增角色成功' }
    },
  },
  {
    url: '/api/tenant/auth/role/:id',
    method: 'PUT',
    response: ({ params, body }: { params: Record<string, string>; body: Partial<RoleRecord> }) => {
      const id = Number(params?.id)
      roleData = roleData.map((item) => (item.id === id ? { ...item, ...body, id: item.id } : item))
      userData = userData.map((user) => ({ ...user, roleNames: hydrateRoleNames(user.roleIds) }))
      return { code: 200, data: null, msg: '更新角色成功' }
    },
  },
  {
    url: '/api/tenant/auth/role/:id',
    method: 'DELETE',
    response: ({ params }: { params: Record<string, string> }) => {
      const id = Number(params?.id)
      roleData = roleData.filter((item) => item.id !== id)
      userData = userData.map((user) => {
        const roleIds = user.roleIds.filter((roleId) => roleId !== id)
        return { ...user, roleIds, roleNames: hydrateRoleNames(roleIds) }
      })
      return { code: 200, data: null, msg: '删除角色成功' }
    },
  },

  // ==================== 菜单（树形） ====================
  {
    url: '/api/tenant/auth/menu/tree',
    method: 'GET',
    response: ({ query }: { query: Record<string, string> }) => {
      const clientType = (query?.clientType || 'admin') as ClientType
      return { code: 200, data: getMenuDataByClientType(clientType), msg: 'success' }
    },
  },
  {
    url: '/api/tenant/auth/menu',
    method: 'POST',
    response: ({ body }: { body: Partial<MenuRecord> }) => {
      const clientType = (body.clientType || 'admin') as ClientType
      const menus = getMenuDataByClientType(clientType)
      const id = nextIdFromTree(menus)
      const newMenu: MenuRecord = {
        id,
        parentId: Number(body.parentId ?? 0),
        name: String(body.name || `菜单${id}`),
        path: body.path,
        icon: body.icon,
        component: body.component,
        permission: body.permission,
        clientType,
        type: Number(body.type ?? 2),
        sort: Number(body.sort ?? 0),
        visible: body.visible === 0 ? 0 : 1,
        status: body.status === 0 ? 0 : 1,
        createdAt: now(),
      }
      if (newMenu.parentId === 0) {
        menus.push(newMenu)
      } else {
        findAndInsertMenu(menus, newMenu.parentId, newMenu)
      }
      return { code: 200, data: { id }, msg: '新增菜单成功' }
    },
  },
  {
    url: '/api/tenant/auth/menu/:id',
    method: 'PUT',
    response: ({ params, body }: { params: Record<string, string>; body: Partial<MenuRecord> }) => {
      const id = Number(params?.id)
      updateMenuInTree(adminMenuData, id, body)
      updateMenuInTree(miniappMenuData, id, body)
      return { code: 200, data: null, msg: '更新菜单成功' }
    },
  },
  {
    url: '/api/tenant/auth/menu/:id',
    method: 'DELETE',
    response: ({ params }: { params: Record<string, string> }) => {
      const id = Number(params?.id)
      deleteMenuFromTree(adminMenuData, id)
      deleteMenuFromTree(miniappMenuData, id)
      return { code: 200, data: null, msg: '删除菜单成功' }
    },
  },

  // ==================== 部门 ====================
  {
    url: '/api/tenant/auth/dept/tree',
    method: 'GET',
    response: ({ query }: { query: Record<string, string> }) => {
      const clientType = (query?.clientType || 'admin') as ClientType
      return { code: 200, data: clientType === 'admin' ? adminDeptData : miniappDeptData, msg: 'success' }
    },
  },
]
