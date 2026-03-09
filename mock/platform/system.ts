const mockUsers = [
  { id: 1, username: 'admin', nickname: '超级管理员', phone: '13800000001', email: 'admin@test.com', avatar: '', roleId: 1, roleName: '超级管理员', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 2, username: 'zhangsan', nickname: '张三', phone: '13800000002', email: 'zhangsan@test.com', avatar: '', roleId: 2, roleName: '运营管理员', status: 1, createdAt: '2024-01-05', updatedAt: '2024-01-05' },
  { id: 3, username: 'lisi', nickname: '李四', phone: '13800000003', email: 'lisi@test.com', avatar: '', roleId: 3, roleName: '普通用户', status: 1, createdAt: '2024-02-10', updatedAt: '2024-02-10' },
  { id: 4, username: 'wangwu', nickname: '王五', phone: '13800000004', email: 'wangwu@test.com', avatar: '', roleId: 2, roleName: '运营管理员', status: 0, createdAt: '2024-03-01', updatedAt: '2024-03-01' },
  { id: 5, username: 'zhaoliu', nickname: '赵六', phone: '13800000005', email: 'zhaoliu@test.com', avatar: '', roleId: 3, roleName: '普通用户', status: 1, createdAt: '2024-03-15', updatedAt: '2024-03-15' },
]

const mockRoles = [
  { id: 1, name: '超级管理员', code: 'super_admin', description: '拥有所有权限', menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], deptIds: [1, 2, 3, 4, 5, 6, 7], status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 2, name: '运营管理员', code: 'operator', description: '负责日常运营管理', menuIds: [1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26], deptIds: [1, 2, 3], status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 3, name: '普通用户', code: 'user', description: '基础查看权限', menuIds: [1, 2, 11], deptIds: [1], status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 4, name: '财务管理员', code: 'finance', description: '负责财务相关操作', menuIds: [1, 5, 6, 23, 27, 28, 29, 30], deptIds: [4], status: 0, createdAt: '2024-02-01', updatedAt: '2024-02-01' },
]

const mockDepts = [
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

const mockMenus = [
  {
    id: 1, parentId: 0, name: '首页', path: '/', icon: 'DashboardOutlined', component: '/Dashboard', permission: 'dashboard', type: 1, sort: 0, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
    children: [],
  },
  {
    id: 2, parentId: 0, name: '商户管理', path: '/tenant', icon: 'ShopOutlined', component: '/Tenant', permission: 'tenant', type: 2, sort: 1, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
    children: [
      { id: 11, parentId: 2, name: '查询', path: '', icon: '', component: '', permission: 'tenant:list', type: 3, sort: 0, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 12, parentId: 2, name: '新增', path: '', icon: '', component: '', permission: 'tenant:create', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 13, parentId: 2, name: '编辑', path: '', icon: '', component: '', permission: 'tenant:update', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 14, parentId: 2, name: '删除', path: '', icon: '', component: '', permission: 'tenant:delete', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
    ],
  },
  {
    id: 3, parentId: 0, name: '订单管理', path: '/order', icon: 'FileTextOutlined', component: '/Order', permission: 'order', type: 2, sort: 2, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
    children: [
      { id: 15, parentId: 3, name: '查询', path: '', icon: '', component: '', permission: 'order:list', type: 3, sort: 0, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 16, parentId: 3, name: '新增', path: '', icon: '', component: '', permission: 'order:create', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 17, parentId: 3, name: '编辑', path: '', icon: '', component: '', permission: 'order:update', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 18, parentId: 3, name: '删除', path: '', icon: '', component: '', permission: 'order:delete', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
    ],
  },
  {
    id: 4, parentId: 0, name: '员工管理', path: '/employee', icon: 'TeamOutlined', component: '/Employee', permission: 'employee', type: 2, sort: 3, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
    children: [
      { id: 19, parentId: 4, name: '查询', path: '', icon: '', component: '', permission: 'employee:list', type: 3, sort: 0, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 20, parentId: 4, name: '新增', path: '', icon: '', component: '', permission: 'employee:create', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 21, parentId: 4, name: '编辑', path: '', icon: '', component: '', permission: 'employee:update', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 22, parentId: 4, name: '删除', path: '', icon: '', component: '', permission: 'employee:delete', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
    ],
  },
  {
    id: 5, parentId: 0, name: '房间管理', path: '/room', icon: 'HomeOutlined', component: '/Room', permission: 'room', type: 2, sort: 4, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
    children: [
      { id: 23, parentId: 5, name: '查询', path: '', icon: '', component: '', permission: 'room:list', type: 3, sort: 0, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 24, parentId: 5, name: '新增', path: '', icon: '', component: '', permission: 'room:create', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 25, parentId: 5, name: '编辑', path: '', icon: '', component: '', permission: 'room:update', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 26, parentId: 5, name: '删除', path: '', icon: '', component: '', permission: 'room:delete', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
    ],
  },
  {
    id: 6, parentId: 0, name: '支付管理', path: '/payment', icon: 'FileTextOutlined', component: '/Payment', permission: 'payment', type: 2, sort: 5, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
    children: [
      { id: 27, parentId: 6, name: '查询', path: '', icon: '', component: '', permission: 'payment:list', type: 3, sort: 0, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 28, parentId: 6, name: '新增', path: '', icon: '', component: '', permission: 'payment:create', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 29, parentId: 6, name: '编辑', path: '', icon: '', component: '', permission: 'payment:update', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
      { id: 30, parentId: 6, name: '删除', path: '', icon: '', component: '', permission: 'payment:delete', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
    ],
  },
  {
    id: 7, parentId: 0, name: '系统管理', path: '/system', icon: 'SettingOutlined', component: '', permission: 'system', type: 1, sort: 6, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
    children: [
      {
        id: 8, parentId: 7, name: '用户管理', path: '/system/user', icon: 'UserOutlined', component: '/System/User', permission: 'system:user', type: 2, sort: 0, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
        children: [
          { id: 31, parentId: 8, name: '查询', path: '', icon: '', component: '', permission: 'system:user:list', type: 3, sort: 0, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
          { id: 32, parentId: 8, name: '新增', path: '', icon: '', component: '', permission: 'system:user:create', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
          { id: 33, parentId: 8, name: '编辑', path: '', icon: '', component: '', permission: 'system:user:update', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
          { id: 34, parentId: 8, name: '删除', path: '', icon: '', component: '', permission: 'system:user:delete', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
          { id: 35, parentId: 8, name: '重置密码', path: '', icon: '', component: '', permission: 'system:user:resetPwd', type: 3, sort: 4, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
        ],
      },
      {
        id: 9, parentId: 7, name: '角色管理', path: '/system/role', icon: 'SafetyCertificateOutlined', component: '/System/Role', permission: 'system:role', type: 2, sort: 1, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
        children: [
          { id: 36, parentId: 9, name: '查询', path: '', icon: '', component: '', permission: 'system:role:list', type: 3, sort: 0, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
          { id: 37, parentId: 9, name: '新增', path: '', icon: '', component: '', permission: 'system:role:create', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
          { id: 38, parentId: 9, name: '编辑', path: '', icon: '', component: '', permission: 'system:role:update', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
          { id: 39, parentId: 9, name: '删除', path: '', icon: '', component: '', permission: 'system:role:delete', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
          { id: 40, parentId: 9, name: '分配权限', path: '', icon: '', component: '', permission: 'system:role:permission', type: 3, sort: 4, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
        ],
      },
      {
        id: 10, parentId: 7, name: '菜单管理', path: '/system/menu', icon: 'MenuOutlined', component: '/System/Menu', permission: 'system:menu', type: 2, sort: 2, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
        children: [
          { id: 41, parentId: 10, name: '查询', path: '', icon: '', component: '', permission: 'system:menu:list', type: 3, sort: 0, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
          { id: 42, parentId: 10, name: '新增', path: '', icon: '', component: '', permission: 'system:menu:create', type: 3, sort: 1, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
          { id: 43, parentId: 10, name: '编辑', path: '', icon: '', component: '', permission: 'system:menu:update', type: 3, sort: 2, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
          { id: 44, parentId: 10, name: '删除', path: '', icon: '', component: '', permission: 'system:menu:delete', type: 3, sort: 3, visible: 1, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01', children: [] },
        ],
      },
    ],
  },
]

export default [
  // ==================== 用户管理 ====================
  {
    url: '/api/admin/system/user/list',
    method: 'POST',
    response: ({ body }: { body: Record<string, any> }) => {
      const pageNum = Number(body?.pageNum) || 1
      const pageSize = Number(body?.pageSize) || 10
      let filtered = [...mockUsers]
      if (body?.username) filtered = filtered.filter((u) => u.username.includes(body.username))
      if (body?.nickname) filtered = filtered.filter((u) => u.nickname.includes(body.nickname))
      if (body?.phone) filtered = filtered.filter((u) => u.phone.includes(body.phone))
      if (body?.status !== undefined && body?.status !== '') filtered = filtered.filter((u) => u.status === Number(body.status))
      const start = (pageNum - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)
      return { code: 200, data: { list, total: filtered.length }, msg: 'success' }
    },
  },
  {
    url: '/api/admin/system/user/:id',
    method: 'GET',
    response: ({ params }: { params: Record<string, string> }) => {
      const user = mockUsers.find((u) => u.id === Number(params.id))
      return { code: 200, data: user || null, msg: 'success' }
    },
  },
  {
    url: '/api/admin/system/user',
    method: 'POST',
    response: () => ({ code: 200, data: { id: mockUsers.length + 1 }, msg: '新增成功' }),
  },
  {
    url: '/api/admin/system/user/:id',
    method: 'PUT',
    response: () => ({ code: 200, data: null, msg: '更新成功' }),
  },
  {
    url: '/api/admin/system/user/:id',
    method: 'DELETE',
    response: () => ({ code: 200, data: null, msg: '删除成功' }),
  },
  {
    url: '/api/admin/system/user/:id/reset-password',
    method: 'PUT',
    response: () => ({ code: 200, data: null, msg: '密码重置成功' }),
  },

  // ==================== 角色管理 ====================
  {
    url: '/api/admin/system/role/list',
    method: 'POST',
    response: ({ body }: { body: Record<string, any> }) => {
      const pageNum = Number(body?.pageNum) || 1
      const pageSize = Number(body?.pageSize) || 10
      let filtered = [...mockRoles]
      if (body?.name) filtered = filtered.filter((r) => r.name.includes(body.name))
      if (body?.code) filtered = filtered.filter((r) => r.code.includes(body.code))
      if (body?.status !== undefined && body?.status !== '') filtered = filtered.filter((r) => r.status === Number(body.status))
      const start = (pageNum - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)
      return { code: 200, data: { list, total: filtered.length }, msg: 'success' }
    },
  },
  {
    url: '/api/admin/system/role/all',
    method: 'GET',
    response: () => ({ code: 200, data: mockRoles, msg: 'success' }),
  },
  {
    url: '/api/admin/system/role/:id',
    method: 'GET',
    response: ({ params }: { params: Record<string, string> }) => {
      const role = mockRoles.find((r) => r.id === Number(params.id))
      return { code: 200, data: role || null, msg: 'success' }
    },
  },
  {
    url: '/api/admin/system/role',
    method: 'POST',
    response: () => ({ code: 200, data: { id: mockRoles.length + 1 }, msg: '新增成功' }),
  },
  {
    url: '/api/admin/system/role/:id',
    method: 'PUT',
    response: () => ({ code: 200, data: null, msg: '更新成功' }),
  },
  {
    url: '/api/admin/system/role/:id/permission',
    method: 'PUT',
    response: () => ({ code: 200, data: null, msg: '权限更新成功' }),
  },
  {
    url: '/api/admin/system/role/:id',
    method: 'DELETE',
    response: () => ({ code: 200, data: null, msg: '删除成功' }),
  },

  // ==================== 菜单管理 ====================
  {
    url: '/api/admin/system/menu/tree',
    method: 'GET',
    response: () => ({ code: 200, data: mockMenus, msg: 'success' }),
  },
  {
    url: '/api/admin/system/menu/:id',
    method: 'GET',
    response: ({ params }: { params: Record<string, string> }) => {
      const findMenu = (menus: any[], id: number): any => {
        for (const menu of menus) {
          if (menu.id === id) return menu
          if (menu.children) {
            const found = findMenu(menu.children, id)
            if (found) return found
          }
        }
        return null
      }
      return { code: 200, data: findMenu(mockMenus, Number(params.id)), msg: 'success' }
    },
  },
  {
    url: '/api/admin/system/menu',
    method: 'POST',
    response: () => ({ code: 200, data: { id: 11 }, msg: '新增成功' }),
  },
  {
    url: '/api/admin/system/menu/:id',
    method: 'PUT',
    response: () => ({ code: 200, data: null, msg: '更新成功' }),
  },
  {
    url: '/api/admin/system/menu/:id',
    method: 'DELETE',
    response: () => ({ code: 200, data: null, msg: '删除成功' }),
  },

  // ==================== 部门管理 ====================
  {
    url: '/api/admin/system/dept/tree',
    method: 'GET',
    response: () => ({ code: 200, data: mockDepts, msg: 'success' }),
  },
]
