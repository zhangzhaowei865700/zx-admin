const mockOrders = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  orderNo: `ORD${String(20240001 + i)}`,
  customerName: `客户${i + 1}`,
  amount: Math.round(Math.random() * 10000) / 100,
  status: [0, 1, 2, 3][Math.floor(Math.random() * 4)],
  createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
}))

export default [
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
]
