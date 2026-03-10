import { useRef, useState, useMemo } from 'react'
import { Button, Popconfirm, Tag, Space } from 'antd'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { PageContainer } from '@/components/common/PageContainer'
import { EditableProTable } from '@/components/common/ProTable'
import { useTranslation } from 'react-i18next'
import { getProductList } from '@/api/modules/tenant'
import type { TenantProduct } from '@/types'
import { useProductMutations } from './hooks/useProduct'

export const TenantProductPage: React.FC = () => {
  const { t } = useTranslation(['product', 'common'])
  const actionRef = useRef<ActionType>()
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const clearSelection = () => setSelectedRowKeys([])
  const { save, create, remove, batchRemove, batchStatus } = useProductMutations(actionRef, clearSelection)

  const columns: ProColumns<TenantProduct>[] = useMemo(
    () => [
      { title: t('common:id'), dataIndex: 'id', width: 60, editable: false, search: false },
      {
        title: t('product:productName'),
        dataIndex: 'name',
        width: 180,
        formItemProps: {
          rules: [{ required: true, message: t('product:productNameRequired', '请输入商品名称') }],
        },
      },
      {
        title: t('product:category'),
        dataIndex: 'category',
        valueType: 'select',
        width: 120,
        valueEnum: {
          电子产品: { text: t('product:categoryElectronics') },
          食品: { text: t('product:categoryFood') },
          服装: { text: t('product:categoryClothing') },
          家居: { text: t('product:categoryHome') },
        },
        formItemProps: {
          rules: [{ required: true, message: t('product:categoryRequired', '请选择分类') }],
        },
      },
      {
        title: t('product:price'),
        dataIndex: 'price',
        valueType: 'money',
        width: 120,
        search: false,
        formItemProps: {
          rules: [{ required: true, message: t('product:priceRequired', '请输入价格') }],
        },
      },
      {
        title: t('product:stock'),
        dataIndex: 'stock',
        valueType: 'digit',
        width: 100,
        search: false,
        formItemProps: {
          rules: [{ required: true, message: t('product:stockRequired', '请输入库存') }],
        },
      },
      {
        title: t('common:status'),
        dataIndex: 'status',
        valueType: 'select',
        width: 100,
        valueEnum: {
          1: { text: t('product:onSale'), status: 'Success' },
          0: { text: t('product:offSale'), status: 'Default' },
        },
        render: (_: unknown, record: TenantProduct) => (
          <Tag color={record.status === 1 ? 'green' : 'default'}>
            {record.status === 1 ? t('product:onSale') : t('product:offSale')}
          </Tag>
        ),
      },
      {
        title: t('common:createTime'),
        dataIndex: 'createdAt',
        valueType: 'dateTime',
        width: 160,
        editable: false,
        search: false,
      },
      {
        title: t('common:operation'),
        valueType: 'option',
        width: 160,
        render: (_text, record, _, action) => [
          <a key="editable" onClick={() => action?.startEditable?.(record.id)}>
            {t('common:edit')}
          </a>,
          <Popconfirm
            key="delete"
            title={t('common:confirmDelete')}
            onConfirm={() => remove.mutate(record.id)}
          >
            <a style={{ color: '#ff4d4f' }}>{t('common:delete')}</a>
          </Popconfirm>,
        ],
      },
    ],
    [t, remove],
  )

  return (
    <PageContainer>
      <EditableProTable<TenantProduct>
        rowKey="id"
        actionRef={actionRef}
        headerTitle={t('product:title')}
        columns={columns}
        request={async (params) => {
          const result = await getProductList({
            pageNum: params.current,
            pageSize: params.pageSize,
            name: params.name,
            category: params.category,
            status: params.status,
          })
          return { data: result.list, success: true, total: result.total }
        }}
        recordCreatorProps={false}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (_key, row) => {
            await save.mutateAsync({ id: row.id, data: row })
          },
          onChange: setEditableRowKeys,
        }}
        search={{ labelWidth: 'auto' }}
        options={{ density: true, setting: true, reload: true }}
        exportable
        exportFileName={t('product:title')}
        pagination={{ pageSize: 10 }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        tableAlertRender={({ selectedRowKeys: keys, onCleanSelected }) => (
          <Space>
            <span>{t('common:selected', { count: keys.length })}</span>
            <a onClick={onCleanSelected}>{t('common:cancelSelect')}</a>
          </Space>
        )}
        tableAlertOptionRender={({ onCleanSelected }) => (
          <Space>
            <a
              onClick={() => {
                batchStatus.mutate({ ids: selectedRowKeys as number[], status: 1 })
                onCleanSelected()
              }}
            >
              {t('product:batchOnSale')}
            </a>
            <a
              onClick={() => {
                batchStatus.mutate({ ids: selectedRowKeys as number[], status: 0 })
                onCleanSelected()
              }}
            >
              {t('product:batchOffSale')}
            </a>
            <Popconfirm
              title={t('product:confirmDeleteProducts', { count: selectedRowKeys.length })}
              onConfirm={() => {
                batchRemove.mutate(selectedRowKeys as number[])
                setEditableRowKeys((prev) => prev.filter((key) => !selectedRowKeys.includes(key)))
                onCleanSelected()
              }}
            >
              <a style={{ color: '#ff4d4f' }}>{t('common:batchDelete')}</a>
            </Popconfirm>
          </Space>
        )}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={async () => {
              const result = await create.mutateAsync({
                name: '',
                category: '电子产品',
                price: 0,
                stock: 0,
                status: 1,
              })
              if (result && typeof result === 'object' && 'id' in result) {
                setEditableRowKeys((prev) => [...prev, (result as { id: number }).id])
              }
            }}
          >
            {t('product:addProduct')}
          </Button>,
        ]}
      />
    </PageContainer>
  )
}
