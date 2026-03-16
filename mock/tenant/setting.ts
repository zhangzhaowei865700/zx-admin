import { withAuth } from '../platform/auth'

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
  {
    url: '/api/tenant/setting',
    method: 'GET',
    response: withAuth(() => ({ code: 200, data: mockStoreSetting, msg: 'success' })),
  },
  {
    url: '/api/tenant/setting',
    method: 'PUT',
    response: withAuth(() => ({ code: 200, data: null, msg: '保存成功' })),
  },
]
