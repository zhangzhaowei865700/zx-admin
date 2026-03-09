const mockOrders = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  orderNo: `ORD${String(20240001 + i)}`,
  customerName: `客户${i + 1}`,
  amount: Math.round(Math.random() * 10000) / 100,
  status: [0, 1, 2, 3][Math.floor(Math.random() * 4)],
  createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
}))

const mockProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `商品${i + 1}`,
  price: Math.round(Math.random() * 50000) / 100,
  stock: Math.floor(Math.random() * 500),
  category: ['电子产品', '食品', '服装', '家居'][i % 4],
  status: i % 5 === 0 ? 0 : 1,
  createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
}))

const mockStoreSetting = {
  storeName: '示例店铺',
  storeDesc: '这是一家示例店铺',
  storeLogo: '',
  contactPhone: '13800138000',
  contactEmail: 'store@example.com',
  address: '北京市朝阳区xxx路xxx号',
  isOpen: true,
  autoConfirm: false,
}

export default [
  // ==================== 订单管理 ====================
  {
    url: '/api/tenant/order/list',
    method: 'POST',
    response: ({ body }: { body: Record<string, any> }) => {
      const pageNum = Number(body?.pageNum) || 1
      const pageSize = Number(body?.pageSize) || 10
      let filtered = [...mockOrders]
      if (body?.orderNo) filtered = filtered.filter((o) => o.orderNo.includes(body.orderNo))
      if (body?.customerName) filtered = filtered.filter((o) => o.customerName.includes(body.customerName))
      if (body?.status !== undefined && body?.status !== '') filtered = filtered.filter((o) => o.status === Number(body.status))
      const start = (pageNum - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)
      return { code: 200, data: { list, total: filtered.length }, msg: 'success' }
    },
  },
  {
    url: '/api/tenant/order/:id',
    method: 'DELETE',
    response: () => ({ code: 200, data: null, msg: '删除成功' }),
  },
  {
    url: '/api/tenant/order/batch',
    method: 'DELETE',
    response: () => ({ code: 200, data: null, msg: '批量删除成功' }),
  },

  // ==================== 商品管理 ====================
  {
    url: '/api/tenant/product/list',
    method: 'POST',
    response: ({ body }: { body: Record<string, any> }) => {
      const pageNum = Number(body?.pageNum) || 1
      const pageSize = Number(body?.pageSize) || 10
      let filtered = [...mockProducts]
      if (body?.name) filtered = filtered.filter((p) => p.name.includes(body.name))
      if (body?.category) filtered = filtered.filter((p) => p.category === body.category)
      if (body?.status !== undefined && body?.status !== '') filtered = filtered.filter((p) => p.status === Number(body.status))
      const start = (pageNum - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)
      return { code: 200, data: { list, total: filtered.length }, msg: 'success' }
    },
  },
  {
    url: '/api/tenant/product',
    method: 'POST',
    response: () => ({ code: 200, data: { id: mockProducts.length + 1 }, msg: '新增成功' }),
  },
  {
    url: '/api/tenant/product/batch-status',
    method: 'PUT',
    response: () => ({ code: 200, data: null, msg: '状态更新成功' }),
  },
  {
    url: '/api/tenant/product/batch',
    method: 'DELETE',
    response: () => ({ code: 200, data: null, msg: '批量删除成功' }),
  },
  {
    url: '/api/tenant/product/:id',
    method: 'PUT',
    response: () => ({ code: 200, data: null, msg: '更新成功' }),
  },
  {
    url: '/api/tenant/product/:id',
    method: 'DELETE',
    response: () => ({ code: 200, data: null, msg: '删除成功' }),
  },

  // ==================== 店铺设置 ====================
  {
    url: '/api/tenant/setting',
    method: 'GET',
    response: () => ({ code: 200, data: mockStoreSetting, msg: 'success' }),
  },
  {
    url: '/api/tenant/setting',
    method: 'PUT',
    response: () => ({ code: 200, data: null, msg: '保存成功' }),
  },

  // ==================== 仪表盘 ====================
  {
    url: '/api/tenant/dashboard/stats',
    method: 'GET',
    response: () => ({
      code: 200,
      data: {
        todayOrders: 36,
        todayRevenue: 4280.5,
        totalProducts: 152,
        totalCustomers: 1893,
      },
      msg: 'success',
    }),
  },
  {
    url: '/api/tenant/dashboard/recent-orders',
    method: 'GET',
    response: () => ({
      code: 200,
      data: [
        { id: 1, orderNo: 'ORD20240001', customerName: '张三', amount: 128.00, status: 1, createdAt: '2024-01-15 10:00:00' },
        { id: 2, orderNo: 'ORD20240002', customerName: '李四', amount: 256.50, status: 2, createdAt: '2024-01-15 11:00:00' },
        { id: 3, orderNo: 'ORD20240003', customerName: '王五', amount: 89.90, status: 0, createdAt: '2024-01-15 12:00:00' },
        { id: 4, orderNo: 'ORD20240004', customerName: '赵六', amount: 432.00, status: 3, createdAt: '2024-01-15 13:00:00' },
        { id: 5, orderNo: 'ORD20240005', customerName: '钱七', amount: 67.80, status: 1, createdAt: '2024-01-15 14:00:00' },
      ],
      msg: 'success',
    }),
  },
]
