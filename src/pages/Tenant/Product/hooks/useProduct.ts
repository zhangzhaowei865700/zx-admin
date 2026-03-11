import { message } from 'antd'
import type { ActionType } from '@ant-design/pro-components'
import type { RefObject } from 'react'
import type { TenantProduct } from '@/types'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  batchDeleteProducts,
  batchUpdateProductStatus,
} from '@/api/modules/tenant'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

/** 商品 Mutations（创建、更新、删除、批量操作） */
export const useProductMutations = (
  actionRef: RefObject<ActionType | undefined>,
  onSelectionClear: () => void,
) => {
  const { t } = useTranslation(['product', 'common'])

  const submit = useMutation({
    mutationFn: (payload: { record?: TenantProduct; values: Partial<TenantProduct> }) => {
      const { record, values } = payload
      return record ? updateProduct(record.id, values) : createProduct(values)
    },
    onSuccess: (_, { record }) => {
      message.success(record ? t('common:updateSuccess') : t('common:createSuccess'))
      actionRef.current?.reload()
    },
  })

  const remove = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      message.success(t('common:deleteSuccess'))
      actionRef.current?.reload()
    },
  })

  const batchRemove = useMutation({
    mutationFn: (ids: number[]) => batchDeleteProducts(ids),
    onSuccess: () => {
      message.success(t('common:batchDeleteSuccess'))
      onSelectionClear()
      actionRef.current?.reload()
    },
  })

  const batchStatus = useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: number }) =>
      batchUpdateProductStatus(ids, status),
    onSuccess: (_, { status }) => {
      message.success(status === 1 ? t('product:batchOnSaleSuccess') : t('product:batchOffSaleSuccess'))
      onSelectionClear()
      actionRef.current?.reload()
    },
  })

  return { submit, remove, batchRemove, batchStatus }
}
