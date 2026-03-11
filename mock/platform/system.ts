import {
  users, roles, menus, depts,
  nextId, nextIdFromTree,
  findMenuInTree, insertMenuInTree, updateMenuInTree, deleteMenuFromTree,
  hydrateRoleNames,
  type StoreUser, type StoreRole, type StoreMenu,
} from './_store'

const now = () => new Date().toISOString().slice(0, 10)

/** 将 StoreUser 转为前端 SystemUser（隐藏 password / platformIds） */
const toSystemUser = (u: StoreUser) => ({
  id: u.id,
  username: u.username,
  nickname: u.nickname,
  phone: u.phone,
  email: u.email,
  avatar: u.avatar,
  roleIds: u.roleIds,
  roleNames: hydrateRoleNames(u.roleIds),
  status: u.status,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
})

/** 将 StoreRole 转为前端 Role */
const toRole = (r: StoreRole) => ({
  id: r.id,
  name: r.name,
  code: r.code,
  description: r.description,
  menuIds: r.menuIds,
  deptIds: r.deptIds,
  status: r.status,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
})

export default [
  // ==================== 用户管理 ====================
  {
    url: '/api/admin/system/user/list',
    method: 'POST',
    response: ({ body }: { body: Record<string, any> }) => {
      const pageNum = Number(body?.pageNum) || 1
      const pageSize = Number(body?.pageSize) || 10
      let filtered = [...users]
      if (body?.username) filtered = filtered.filter((u) => u.username.includes(body.username))
      if (body?.nickname) filtered = filtered.filter((u) => u.nickname.includes(body.nickname))
      if (body?.phone) filtered = filtered.filter((u) => u.phone.includes(body.phone))
      if (body?.status !== undefined && body?.status !== '')
        filtered = filtered.filter((u) => u.status === Number(body.status))
      const total = filtered.length
      const start = (pageNum - 1) * pageSize
      const list = filtered.slice(start, start + pageSize).map(toSystemUser)
      return { code: 200, data: { list, total }, msg: 'success' }
    },
  },
  {
    url: '/api/admin/system/user/:id',
    method: 'GET',
    response: ({ params }: { params: Record<string, string> }) => {
      const user = users.find((u) => u.id === Number(params?.id))
      return { code: 200, data: user ? toSystemUser(user) : null, msg: 'success' }
    },
  },
  {
    url: '/api/admin/system/user',
    method: 'POST',
    response: ({ body }: { body: Record<string, any> }) => {
      const id = nextId(users)
      const newUser: StoreUser = {
        id,
        username: body.username || '',
        password: body.password || '123456',
        nickname: body.nickname || '',
        phone: body.phone || '',
        email: body.email || '',
        avatar: body.avatar || '',
        status: body.status ?? 1,
        platformIds: body.platformIds || [1],
        roleIds: body.roleIds || [],
        createdAt: now(),
        updatedAt: now(),
      }
      users.push(newUser)
      return { code: 200, data: { id }, msg: '新增成功' }
    },
  },
  {
    url: '/api/admin/system/user/batch-status',
    method: 'PUT',
    response: ({ body }: { body: { ids?: number[]; status?: number } }) => {
      const ids = body?.ids || []
      const status = body?.status ?? 1
      for (const id of ids) {
        const user = users.find((u) => u.id === id)
        if (user) {
          user.status = status
          user.updatedAt = now()
        }
      }
      return { code: 200, data: null, msg: '批量更新成功' }
    },
  },
  {
    url: '/api/admin/system/user/batch',
    method: 'DELETE',
    response: ({ body }: { body: { ids?: number[] } }) => {
      const ids = new Set(body?.ids || [])
      for (let i = users.length - 1; i >= 0; i--) {
        if (ids.has(users[i].id)) users.splice(i, 1)
      }
      return { code: 200, data: null, msg: '批量删除成功' }
    },
  },
  {
    url: '/api/admin/system/user/:id/reset-password',
    method: 'PUT',
    response: ({ params, body }: { params: Record<string, string>; body: { password?: string } }) => {
      const user = users.find((u) => u.id === Number(params?.id))
      if (user) {
        user.password = body?.password || '123456'
        user.updatedAt = now()
      }
      return { code: 200, data: null, msg: '密码重置成功' }
    },
  },
  {
    url: '/api/admin/system/user/:id',
    method: 'PUT',
    response: ({ params, body }: { params: Record<string, string>; body: Record<string, any> }) => {
      const user = users.find((u) => u.id === Number(params?.id))
      if (!user) return { code: 404, data: null, msg: '用户不存在' }
      if (body.nickname !== undefined) user.nickname = body.nickname
      if (body.phone !== undefined) user.phone = body.phone
      if (body.email !== undefined) user.email = body.email
      if (body.avatar !== undefined) user.avatar = body.avatar
      if (body.status !== undefined) user.status = body.status
      if (body.roleIds !== undefined) user.roleIds = body.roleIds
      if (body.platformIds !== undefined) user.platformIds = body.platformIds
      user.updatedAt = now()
      return { code: 200, data: null, msg: '更新成功' }
    },
  },
  {
    url: '/api/admin/system/user/:id',
    method: 'DELETE',
    response: ({ params }: { params: Record<string, string> }) => {
      const idx = users.findIndex((u) => u.id === Number(params?.id))
      if (idx !== -1) users.splice(idx, 1)
      return { code: 200, data: null, msg: '删除成功' }
    },
  },

  // ==================== 角色管理 ====================
  {
    url: '/api/admin/system/role/list',
    method: 'POST',
    response: ({ body }: { body: Record<string, any> }) => {
      const pageNum = Number(body?.pageNum) || 1
      const pageSize = Number(body?.pageSize) || 10
      let filtered = [...roles]
      if (body?.name) filtered = filtered.filter((r) => r.name.includes(body.name))
      if (body?.code) filtered = filtered.filter((r) => r.code.includes(body.code))
      if (body?.status !== undefined && body?.status !== '')
        filtered = filtered.filter((r) => r.status === Number(body.status))
      const total = filtered.length
      const start = (pageNum - 1) * pageSize
      const list = filtered.slice(start, start + pageSize).map(toRole)
      return { code: 200, data: { list, total }, msg: 'success' }
    },
  },
  {
    url: '/api/admin/system/role/all',
    method: 'GET',
    response: () => ({ code: 200, data: roles.map(toRole), msg: 'success' }),
  },
  {
    url: '/api/admin/system/role/:id',
    method: 'GET',
    response: ({ params }: { params: Record<string, string> }) => {
      const role = roles.find((r) => r.id === Number(params?.id))
      return { code: 200, data: role ? toRole(role) : null, msg: 'success' }
    },
  },
  {
    url: '/api/admin/system/role',
    method: 'POST',
    response: ({ body }: { body: Record<string, any> }) => {
      const id = nextId(roles)
      const newRole: StoreRole = {
        id,
        name: body.name || '',
        code: body.code || '',
        description: body.description || '',
        menuIds: body.menuIds || [],
        deptIds: body.deptIds || [],
        status: body.status ?? 1,
        createdAt: now(),
        updatedAt: now(),
      }
      roles.push(newRole)
      return { code: 200, data: { id }, msg: '新增成功' }
    },
  },
  {
    url: '/api/admin/system/role/batch',
    method: 'DELETE',
    response: ({ body }: { body: { ids?: number[] } }) => {
      const ids = new Set(body?.ids || [])
      for (let i = roles.length - 1; i >= 0; i--) {
        if (ids.has(roles[i].id)) roles.splice(i, 1)
      }
      return { code: 200, data: null, msg: '批量删除成功' }
    },
  },
  {
    url: '/api/admin/system/role/:id/permission',
    method: 'PUT',
    response: ({ params, body }: { params: Record<string, string>; body: { menuIds?: number[]; deptIds?: number[] } }) => {
      const role = roles.find((r) => r.id === Number(params?.id))
      if (!role) return { code: 404, data: null, msg: '角色不存在' }
      if (body.menuIds !== undefined) role.menuIds = body.menuIds
      if (body.deptIds !== undefined) role.deptIds = body.deptIds
      role.updatedAt = now()
      return { code: 200, data: null, msg: '权限更新成功' }
    },
  },
  {
    url: '/api/admin/system/role/:id',
    method: 'PUT',
    response: ({ params, body }: { params: Record<string, string>; body: Record<string, any> }) => {
      const role = roles.find((r) => r.id === Number(params?.id))
      if (!role) return { code: 404, data: null, msg: '角色不存在' }
      if (body.name !== undefined) role.name = body.name
      if (body.description !== undefined) role.description = body.description
      if (body.status !== undefined) role.status = body.status
      role.updatedAt = now()
      return { code: 200, data: null, msg: '更新成功' }
    },
  },
  {
    url: '/api/admin/system/role/:id',
    method: 'DELETE',
    response: ({ params }: { params: Record<string, string> }) => {
      const idx = roles.findIndex((r) => r.id === Number(params?.id))
      if (idx !== -1) roles.splice(idx, 1)
      return { code: 200, data: null, msg: '删除成功' }
    },
  },

  // ==================== 菜单管理 ====================
  {
    url: '/api/admin/system/menu/tree',
    method: 'GET',
    response: () => ({ code: 200, data: menus, msg: 'success' }),
  },
  {
    url: '/api/admin/system/menu/:id',
    method: 'GET',
    response: ({ params }: { params: Record<string, string> }) => {
      const menu = findMenuInTree(menus, Number(params?.id))
      return { code: 200, data: menu || null, msg: 'success' }
    },
  },
  {
    url: '/api/admin/system/menu',
    method: 'POST',
    response: ({ body }: { body: Record<string, any> }) => {
      const id = nextIdFromTree(menus)
      const newMenu: StoreMenu = {
        id,
        parentId: body.parentId ?? 0,
        name: body.name || '',
        path: body.path || '',
        icon: body.icon || '',
        component: body.component || '',
        permission: body.permission || '',
        type: body.type ?? 2,
        sort: body.sort ?? 0,
        visible: body.visible ?? 1,
        status: body.status ?? 1,
        children: [],
        createdAt: now(),
        updatedAt: now(),
      }
      if (newMenu.parentId === 0) {
        menus.push(newMenu)
      } else {
        insertMenuInTree(menus, newMenu.parentId, newMenu)
      }
      return { code: 200, data: { id }, msg: '新增成功' }
    },
  },
  {
    url: '/api/admin/system/menu/:id',
    method: 'PUT',
    response: ({ params, body }: { params: Record<string, string>; body: Record<string, any> }) => {
      const id = Number(params?.id)
      const updates: Partial<StoreMenu> = {}
      if (body.name !== undefined) updates.name = body.name
      if (body.path !== undefined) updates.path = body.path
      if (body.icon !== undefined) updates.icon = body.icon
      if (body.component !== undefined) updates.component = body.component
      if (body.permission !== undefined) updates.permission = body.permission
      if (body.type !== undefined) updates.type = body.type
      if (body.sort !== undefined) updates.sort = body.sort
      if (body.visible !== undefined) updates.visible = body.visible
      if (body.status !== undefined) updates.status = body.status
      updates.updatedAt = now()
      updateMenuInTree(menus, id, updates)
      return { code: 200, data: null, msg: '更新成功' }
    },
  },
  {
    url: '/api/admin/system/menu/:id',
    method: 'DELETE',
    response: ({ params }: { params: Record<string, string> }) => {
      deleteMenuFromTree(menus, Number(params?.id))
      return { code: 200, data: null, msg: '删除成功' }
    },
  },

  // ==================== 部门管理 ====================
  {
    url: '/api/admin/system/dept/tree',
    method: 'GET',
    response: () => ({ code: 200, data: depts, msg: 'success' }),
  },
]
