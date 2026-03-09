import request from '@/api/request'
import type { DictType, DictItem } from '@/types/platform/dictionary'

/** 获取所有字典类型 */
export const getDictTypes = () =>
  request<DictType[]>({ url: '/api/system/dict/types', method: 'get' })

/** 根据字典类型编码获取字典项列表 */
export const getDictItems = (dictType: string) =>
  request<DictItem[]>({ url: `/api/system/dict/items/${dictType}`, method: 'get' })
