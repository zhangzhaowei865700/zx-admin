const mockTenants = [
  { id: 1, name: '星巴克旗舰店', code: 'T001', status: 1, contact: '张经理', phone: '13800138001', email: 'starbucks@example.com', address: '北京市朝阳区建国路88号', createdAt: '2024-01-05 09:30:00' },
  { id: 2, name: '肯德基中心店', code: 'T002', status: 1, contact: '李经理', phone: '13800138002', email: 'kfc@example.com', address: '上海市浦东新区陆家嘴环路166号', createdAt: '2024-01-12 14:20:00' },
  { id: 3, name: '麦当劳万达店', code: 'T003', status: 0, contact: '王经理', phone: '13800138003', email: 'mcd@example.com', address: '广州市天河区天河路230号', createdAt: '2024-02-03 10:15:00' },
  { id: 4, name: '瑞幸咖啡科技园店', code: 'T004', status: 1, contact: '赵经理', phone: '13800138004', email: 'luckin@example.com', address: '深圳市南山区科技园南路1号', createdAt: '2024-02-18 16:45:00' },
  { id: 5, name: '喜茶购物中心店', code: 'T005', status: 1, contact: '钱经理', phone: '13800138005', email: 'heytea@example.com', address: '杭州市西湖区延安路258号', createdAt: '2024-03-01 11:00:00' },
  { id: 6, name: '奈雪的茶旗舰店', code: 'T006', status: 1, contact: '孙经理', phone: '13800138006', email: 'nayuki@example.com', address: '成都市锦江区春熙路99号', createdAt: '2024-03-10 08:30:00' },
  { id: 7, name: '必胜客欢乐餐厅', code: 'T007', status: 0, contact: '周经理', phone: '13800138007', email: 'pizzahut@example.com', address: '武汉市武昌区中南路12号', createdAt: '2024-03-22 13:50:00' },
  { id: 8, name: '海底捞火锅', code: 'T008', status: 1, contact: '吴经理', phone: '13800138008', email: 'haidilao@example.com', address: '南京市鼓楼区中山北路178号', createdAt: '2024-04-05 17:20:00' },
  { id: 9, name: '蜜雪冰城总店', code: 'T009', status: 1, contact: '郑经理', phone: '13800138009', email: 'mixue@example.com', address: '郑州市金水区花园路56号', createdAt: '2024-04-15 09:10:00' },
  { id: 10, name: '茶百道旗舰店', code: 'T010', status: 1, contact: '冯经理', phone: '13800138010', email: 'chabaidao@example.com', address: '重庆市渝中区解放碑步行街', createdAt: '2024-05-01 15:30:00' },
]

export default [
  // 获取商户列表
  {
    url: '/api/admin/tenant/list',
    method: 'POST',
    response: ({ body }: { body: Record<string, string> }) => {
      const pageNum = Number(body?.pageNum) || 1
      const pageSize = Number(body?.pageSize) || 10
      let filtered = [...mockTenants]
      if (body?.name) {
        filtered = filtered.filter((t) => t.name.includes(body.name))
      }
      if (body?.status !== undefined && body?.status !== '') {
        filtered = filtered.filter((t) => t.status === Number(body.status))
      }
      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      const list = filtered.slice(start, end)
      return {
        code: 200,
        data: { list, total: filtered.length },
        msg: 'success',
      }
    },
  },
  // 新增商户
  {
    url: '/api/admin/tenant',
    method: 'POST',
    response: () => ({
      code: 200,
      data: { id: mockTenants.length + 1 },
      msg: '新增成功',
    }),
  },
  // 更新商户
  {
    url: '/api/admin/tenant/:id',
    method: 'PUT',
    response: () => ({
      code: 200,
      data: null,
      msg: '更新成功',
    }),
  },
  // 删除商户
  {
    url: '/api/admin/tenant/:id',
    method: 'DELETE',
    response: () => ({
      code: 200,
      data: null,
      msg: '删除成功',
    }),
  },
  // 获取商户详情
  {
    url: '/api/admin/tenant/:id',
    method: 'GET',
    response: ({ params }: { params: { id: string } }) => {
      const tenant = mockTenants.find((t) => t.id === Number(params?.id))
      return {
        code: 200,
        data: tenant || null,
        msg: tenant ? 'success' : '商户不存在',
      }
    },
  },
]
