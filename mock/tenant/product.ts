const mockProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `商品${i + 1}`,
  price: Math.round(Math.random() * 50000) / 100,
  stock: Math.floor(Math.random() * 500),
  category: ['电子产品', '食品', '服装', '家居'][i % 4],
  status: i % 5 === 0 ? 0 : 1,
  createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
}))

export default [
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
]
