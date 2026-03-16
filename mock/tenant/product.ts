import { withAuth } from '../platform/auth'

const units = ['个', '件', '箱', 'kg', '台']
const descriptions = [
  '高品质产品，性价比极高',
  '新款热销产品，库存有限',
  '经典款式，持续畅销',
  '限时优惠，先到先得',
  '品牌直供，正品保障',
]

const mockProducts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `商品${i + 1}`,
  description: descriptions[i % descriptions.length],
  price: Math.round(Math.random() * 50000) / 100,
  stock: Math.floor(Math.random() * 500),
  category: ['电子产品', '食品', '服装', '家居'][i % 4],
  unit: units[i % units.length],
  status: i % 5 === 0 ? 0 : 1,
  createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
}))

let nextId = mockProducts.length + 1

// 规格 mock 数据
const specNames = ['颜色', '尺寸', '材质', '款式']
const specValueMap: Record<string, string[]> = {
  颜色: ['红色', '蓝色', '黑色', '白色'],
  尺寸: ['S', 'M', 'L', 'XL'],
  材质: ['棉', '涤纶', '丝绸', '羊毛'],
  款式: ['经典款', '商务款', '运动款', '休闲款'],
}

const mockSpecs: Record<number, any[]> = {}
let specNextId = 1
for (let pid = 1; pid <= 20; pid++) {
  const count = (pid % 3) + 1
  mockSpecs[pid] = Array.from({ length: count }, (_, i) => {
    const specName = specNames[i % specNames.length]
    return {
      id: specNextId++,
      productId: pid,
      specName,
      specValue: specValueMap[specName][pid % specValueMap[specName].length],
      price: Math.round(Math.random() * 10000) / 100,
      stock: Math.floor(Math.random() * 200),
      sort: i + 1,
    }
  })
}

export default [
  {
    url: '/api/tenant/product/list',
    method: 'POST',
    response: withAuth(({ body }: { body: Record<string, any>; headers?: Record<string, string> }) => {
      const pageNum = Number(body?.pageNum) || 1
      const pageSize = Number(body?.pageSize) || 10
      let filtered = [...mockProducts]
      if (body?.name) filtered = filtered.filter((p) => p.name.includes(body.name))
      if (body?.category) filtered = filtered.filter((p) => p.category === body.category)
      if (body?.status !== undefined && body?.status !== '') filtered = filtered.filter((p) => p.status === Number(body.status))
      const start = (pageNum - 1) * pageSize
      const list = filtered.slice(start, start + pageSize)
      return { code: 200, data: { list, total: filtered.length }, msg: 'success' }
    }),
  },
  {
    url: '/api/tenant/product',
    method: 'POST',
    response: withAuth(({ body }: { body: Record<string, any>; headers?: Record<string, string> }) => {
      const newProduct = {
        id: nextId++,
        name: body.name || '',
        description: body.description || '',
        price: body.price || 0,
        stock: body.stock || 0,
        category: body.category || '电子产品',
        unit: body.unit || '个',
        status: body.status ?? 1,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      }
      mockProducts.unshift(newProduct)
      return { code: 200, data: { id: newProduct.id }, msg: '新增成功' }
    }),
  },
  {
    url: '/api/tenant/product/batch-status',
    method: 'PUT',
    response: withAuth(() => ({ code: 200, data: null, msg: '状态更新成功' })),
  },
  {
    url: '/api/tenant/product/batch',
    method: 'DELETE',
    response: withAuth(() => ({ code: 200, data: null, msg: '批量删除成功' })),
  },
  // 规格列表
  {
    url: '/api/tenant/product/:id/specs',
    method: 'GET',
    response: withAuth(({ query }: { query: Record<string, any>; headers?: Record<string, string> }) => {
      const productId = Number(query?.id || 0)
      return { code: 200, data: mockSpecs[productId] || [], msg: 'success' }
    }),
  },
  // 保存规格（新增或更新）
  {
    url: '/api/tenant/product/:id/spec',
    method: 'POST',
    response: withAuth(({ body, query }: { body: Record<string, any>; query: Record<string, any>; headers?: Record<string, string> }) => {
      const productId = Number(query?.id || body?.productId || 0)
      if (!mockSpecs[productId]) mockSpecs[productId] = []
      if (body.id && typeof body.id === 'number') {
        // 更新
        const idx = mockSpecs[productId].findIndex((s: any) => s.id === body.id)
        if (idx >= 0) Object.assign(mockSpecs[productId][idx], body)
      } else {
        // 新增
        const newSpec = { ...body, id: specNextId++, productId }
        mockSpecs[productId].push(newSpec)
      }
      return { code: 200, data: null, msg: '保存成功' }
    }),
  },
  // 删除规格
  {
    url: '/api/tenant/product/:id/spec/:specId',
    method: 'DELETE',
    response: withAuth(({ query }: { query: Record<string, any>; headers?: Record<string, string> }) => {
      const productId = Number(query?.id || 0)
      const specId = Number(query?.specId || 0)
      if (mockSpecs[productId]) {
        mockSpecs[productId] = mockSpecs[productId].filter((s: any) => s.id !== specId)
      }
      return { code: 200, data: null, msg: '删除成功' }
    }),
  },
  {
    url: '/api/tenant/product/:id',
    method: 'PUT',
    response: withAuth(({ body }: { body: Record<string, any>; headers?: Record<string, string> }) => {
      const id = Number(body?.id)
      const idx = mockProducts.findIndex((p) => p.id === id)
      if (idx >= 0) {
        Object.assign(mockProducts[idx], body)
      }
      return { code: 200, data: null, msg: '更新成功' }
    }),
  },
  {
    url: '/api/tenant/product/:id',
    method: 'DELETE',
    response: withAuth(() => ({ code: 200, data: null, msg: '删除成功' })),
  },
]
