import React from 'react'
import { Tag } from 'antd'
import { useDictionary } from '@/hooks/useDictionary'

interface DictTagProps {
  /** 字典类型编码 */
  dictType: string
  /** 字典项值 */
  value: string | number
}

/**
 * 字典值展示组件
 *
 * 根据 dictType 和 value 自动查询字典数据，渲染为带颜色的 Tag。
 *
 * @example
 * ```tsx
 * <DictTag dictType="order_status" value={record.status} />
 * ```
 */
export const DictTag: React.FC<DictTagProps> = ({ dictType, value }) => {
  const { getLabel, getColor } = useDictionary(dictType)

  return <Tag color={getColor(value)}>{getLabel(value)}</Tag>
}
