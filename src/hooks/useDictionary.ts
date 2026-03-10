import { useCallback } from 'react'
import { getDictItems } from '@/api/modules/platform/dictionary'
import { queryKeys } from '@/hooks/query'
import { useQuery } from '@tanstack/react-query'

/**
 * 数据字典 Hook
 *
 * 根据字典类型编码获取字典项列表，使用 React Query 缓存（30 分钟 staleTime）。
 *
 * @example
 * ```tsx
 * const { items, getLabel, getColor, options } = useDictionary('order_status')
 *
 * // 在表格列中展示
 * { title: '状态', render: (val) => <DictTag dictType="order_status" value={val} /> }
 *
 * // 在下拉框中使用
 * <Select options={options} />
 * ```
 */
export function useDictionary(dictType: string) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: queryKeys.system.dictItems(dictType),
    queryFn: () => getDictItems(dictType),
    staleTime: 30 * 60 * 1000, // 字典数据变化频率低，30 分钟
    gcTime: 60 * 60 * 1000,
    enabled: !!dictType,
  })

  /** 根据 value 获取 label */
  const getLabel = useCallback(
    (value: string | number): string => {
      const item = items.find((i) => String(i.value) === String(value))
      return item?.label ?? String(value)
    },
    [items]
  )

  /** 根据 value 获取 color */
  const getColor = useCallback(
    (value: string | number): string | undefined => {
      const item = items.find((i) => String(i.value) === String(value))
      return item?.color
    },
    [items]
  )

  /** 转换为 Select/Radio 等组件的 options 格式 */
  const options = items.map((item) => ({
    label: item.label,
    value: item.value,
  }))

  return { items, isLoading, getLabel, getColor, options }
}
