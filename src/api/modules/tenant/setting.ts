import request from '@/api/request'
import type { StoreSetting } from '@/types/tenant'

export const getStoreSetting = () =>
  request<StoreSetting>({
    url: '/api/tenant/setting',
    method: 'GET',
  })

export const updateStoreSetting = (data: StoreSetting) =>
  request({
    url: '/api/tenant/setting',
    method: 'PUT',
    data,
  })
