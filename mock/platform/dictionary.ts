const mockDictData: Record<string, Array<{ id: number; dictType: string; value: string | number; label: string; color?: string; sort: number }>> = {
  order_status: [
    { id: 1, dictType: 'order_status', value: 0, label: '待支付', color: 'default', sort: 1 },
    { id: 2, dictType: 'order_status', value: 1, label: '已支付', color: 'processing', sort: 2 },
    { id: 3, dictType: 'order_status', value: 2, label: '已发货', color: 'warning', sort: 3 },
    { id: 4, dictType: 'order_status', value: 3, label: '已完成', color: 'success', sort: 4 },
    { id: 5, dictType: 'order_status', value: 4, label: '已取消', color: 'error', sort: 5 },
  ],
  gender: [
    { id: 10, dictType: 'gender', value: 1, label: '男', color: 'blue', sort: 1 },
    { id: 11, dictType: 'gender', value: 2, label: '女', color: 'magenta', sort: 2 },
    { id: 12, dictType: 'gender', value: 0, label: '未知', color: 'default', sort: 3 },
  ],
  status: [
    { id: 20, dictType: 'status', value: 1, label: '启用', color: 'success', sort: 1 },
    { id: 21, dictType: 'status', value: 0, label: '禁用', color: 'error', sort: 2 },
  ],
  product_type: [
    { id: 30, dictType: 'product_type', value: 1, label: '实物商品', color: 'blue', sort: 1 },
    { id: 31, dictType: 'product_type', value: 2, label: '虚拟商品', color: 'purple', sort: 2 },
    { id: 32, dictType: 'product_type', value: 3, label: '服务商品', color: 'cyan', sort: 3 },
  ],
}

const mockDictTypes = [
  { id: 1, code: 'order_status', name: '订单状态', remark: '订单流转状态' },
  { id: 2, code: 'gender', name: '性别', remark: '用户性别' },
  { id: 3, code: 'status', name: '通用状态', remark: '启用/禁用' },
  { id: 4, code: 'product_type', name: '商品类型', remark: '商品分类类型' },
]

export default [
  {
    url: '/api/system/dict/types',
    method: 'get',
    response: () => ({
      code: 200,
      data: mockDictTypes,
      msg: 'ok',
    }),
  },
  {
    url: '/api/system/dict/items/:dictType',
    method: 'get',
    response: ({ url }: { url: string }) => {
      const dictType = url.split('/').pop() || ''
      const items = mockDictData[dictType] || []
      return {
        code: 200,
        data: items,
        msg: 'ok',
      }
    },
  },
]
