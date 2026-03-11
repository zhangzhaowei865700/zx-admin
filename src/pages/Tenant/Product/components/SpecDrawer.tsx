import { useState, useMemo, useRef } from 'react'
import { Drawer, Button, Popconfirm, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { EditableProTable } from '@/components/common/ProTable'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProductSpecs, saveProductSpec, deleteProductSpec } from '@/api/modules/tenant'
import type { ProductSpec, TenantProduct } from '@/types'

interface SpecDrawerProps {
  open: boolean
  product?: TenantProduct
  onClose: () => void
}

export const SpecDrawer: React.FC<SpecDrawerProps> = ({ open, product, onClose }) => {
  const { t } = useTranslation(['product', 'common'])
  const actionRef = useRef<ActionType>()
  const queryClient = useQueryClient()
  const [editableKeys, setEditableKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<ProductSpec[]>([])

  const productId = product?.id ?? 0

  useQuery({
    queryKey: ['productSpecs', productId],
    queryFn: async () => {
      const data = await getProductSpecs(productId)
      setDataSource(data)
      return data
    },
    enabled: open && productId > 0,
  })

  const saveMutation = useMutation({
    mutationFn: (data: Partial<ProductSpec>) => saveProductSpec(productId, data),
    onSuccess: () => {
      message.success(t('common:saveSuccess'))
      queryClient.invalidateQueries({ queryKey: ['productSpecs', productId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (specId: number) => deleteProductSpec(productId, specId),
    onSuccess: () => {
      message.success(t('common:deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: ['productSpecs', productId] })
    },
  })

  const columns: ProColumns<ProductSpec>[] = useMemo(
    () => [
      {
        title: t('product:specName'),
        dataIndex: 'specName',
        width: 120,
        formItemProps: {
          rules: [{ required: true, message: t('product:specNameRequired') }],
        },
      },
      {
        title: t('product:specValue'),
        dataIndex: 'specValue',
        width: 120,
        formItemProps: {
          rules: [{ required: true, message: t('product:specValueRequired') }],
        },
      },
      {
        title: t('product:price'),
        dataIndex: 'price',
        valueType: 'money',
        width: 120,
        formItemProps: {
          rules: [{ required: true, message: t('product:priceRequired') }],
        },
      },
      {
        title: t('product:stock'),
        dataIndex: 'stock',
        valueType: 'digit',
        width: 100,
        formItemProps: {
          rules: [{ required: true, message: t('product:stockRequired') }],
        },
      },
      {
        title: t('product:specSort'),
        dataIndex: 'sort',
        valueType: 'digit',
        width: 80,
      },
      {
        title: t('common:operation'),
        valueType: 'option',
        width: 160,
        render: (_text, record, _, action) => [
          <a key="edit" onClick={() => action?.startEditable?.(record.id)}>
            {t('common:edit')}
          </a>,
          <Popconfirm
            key="delete"
            title={t('common:confirmDelete')}
            onConfirm={() => deleteMutation.mutate(record.id)}
          >
            <a style={{ color: '#ff4d4f' }}>{t('common:delete')}</a>
          </Popconfirm>,
        ],
      },
    ],
    [t, deleteMutation],
  )

  return (
    <Drawer
      title={t('product:specManagement', { name: product?.name })}
      open={open}
      onClose={() => {
        setEditableKeys([])
        onClose()
      }}
      width={800}
      destroyOnClose
    >
      <EditableProTable<ProductSpec>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        value={dataSource}
        onChange={(value) => setDataSource([...value])}
        search={false}
        options={false}
        pagination={false}
        recordCreatorProps={false}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (_key, row) => {
            await saveMutation.mutateAsync(row)
          },
          onChange: setEditableKeys,
          actionRender: (_row, _config, defaultDoms) => [defaultDoms.save, defaultDoms.cancel],
        }}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              const tempId = -(Date.now())
              const newRow: ProductSpec = {
                id: tempId,
                productId,
                specName: '',
                specValue: '',
                price: 0,
                stock: 0,
                sort: dataSource.length + 1,
              }
              setDataSource([...dataSource, newRow])
              setEditableKeys([...editableKeys, tempId])
            }}
          >
            {t('product:addSpec')}
          </Button>,
        ]}
      />
    </Drawer>
  )
}
