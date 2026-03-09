import { useState, useCallback } from 'react'

// 分页配置
export interface PaginationConfig {
  current: number
  pageSize: number
  total: number
}

// 使用分页的 hook
export const usePagination = (initialPageSize = 10) => {
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
  })

  const setCurrent = useCallback((current: number) => {
    setPagination((prev) => ({ ...prev, current }))
  }, [])

  const setPageSize = useCallback((pageSize: number) => {
    setPagination({ current: 1, pageSize, total: 0 })
  }, [])

  const setTotal = useCallback((total: number) => {
    setPagination((prev) => ({ ...prev, total }))
  }, [])

  return {
    pagination,
    setCurrent,
    setPageSize,
    setTotal,
  }
}

// 搜索参数
export const useSearchParams = <T extends Record<string, any>>() => {
  const [params, setParams] = useState<T>({} as T)

  const updateParams = useCallback((newParams: Partial<T>) => {
    setParams((prev) => ({ ...prev, ...newParams }))
  }, [])

  const resetParams = useCallback(() => {
    setParams({} as T)
  }, [])

  return {
    params,
    setParams: updateParams,
    resetParams,
  }
}
