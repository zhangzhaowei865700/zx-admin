import { withAuth } from '../platform/auth'

const SETTING_KEY = '__mock_store_setting__'

const defaultSetting = {
  storeName: '示例店铺',
  storeDesc: '这是一家示例店铺',
  storeLogo: '',
  contactPhone: '13800138000',
  contactEmail: 'store@example.com',
  address: '北京市朝阳区xxx路xxx号',
  isOpen: true,
  autoConfirm: false,
}

const getStoreSetting = () => {
  try {
    const raw = localStorage.getItem(SETTING_KEY)
    return raw ? JSON.parse(raw) : defaultSetting
  } catch {
    return defaultSetting
  }
}

const saveStoreSetting = (data: typeof defaultSetting) => {
  localStorage.setItem(SETTING_KEY, JSON.stringify(data))
}

export default [
  {
    url: '/api/tenant/setting',
    method: 'GET',
    response: withAuth(() => ({ code: 200, data: getStoreSetting(), msg: 'success' })),
  },
  {
    url: '/api/tenant/setting',
    method: 'PUT',
    response: withAuth(({ body }) => {
      saveStoreSetting({ ...getStoreSetting(), ...body })
      return { code: 200, data: null, msg: '保存成功' }
    }),
  },
]
