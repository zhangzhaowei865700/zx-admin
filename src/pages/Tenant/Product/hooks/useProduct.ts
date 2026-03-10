import { message } from 'antd'
import type { ActionType } from '@ant-design/pro-components'
import type { RefObject } from 'react'
import type { TenantProduct } from '@/types/tenant'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  batchDeleteProducts,
  batchUpdateProductStatus,
} from '@/api/modules/tenant'
import { useMutation } from '@tanstack/react-query'

/** 商品 Mutations（创建、更新、删除、批量操作） */
export const useProductMutations = (
  actionRef: RefObject<ActionType | undefined>,
  onSelectionClear: () => void,
) => {
  const save = useMutation({
    mutationFn: ({ id, data }: { id?: number; data: Partial<TenantProduct> }) =>
      id && id > 0 ? updateProduct(id, data) : createProduct(data),
    onSuccess: () => {
      message.success('保存成功')
      actionRef.current?.reload()
    },
  })

  const create = useMutation({
    mutationFn: (data: Partial<TenantProduct>) => createProduct(data),
    onSuccess: () => {
      actionRef.current?.reload()
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      message.success('删除成功')
      actionRef.current?.reload()
    },
  })

  const batchRemove = useMutation({
    mutationFn: (ids: number[]) => batchDeleteProducts(ids),
    onSuccess: () => {
      message.success('批量删除成功')
      onSelectionClear()
      actionRef.current?.reload()
    },
  })

  const batchStatus = useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: number }) =>
      batchUpdateProductStatus(ids, status),
    onSuccess: (_, { status }) => {
      message.success(status === 1 ? '批量上架成功' : '批量下架成功')
      onSelectionClear()
      actionRef.current?.reload()
    },
  })

  return { save, create, remove, batchRemove, batchStatus }
}
