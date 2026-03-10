import { useRef, useState } from 'react'
import { Button, Popconfirm, Tag, message } from 'antd'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { ProTable } from '@/components/common/ProTable'
import { PageContainer } from '@/components/common/PageContainer'
import { FormContainer } from '@/components/common/FormContainer'
import { HasPermission } from '@/components/common/HasPermission'
import { deleteTenant, getTenantList, createTenant, updateTenant, batchDeleteTenants, batchUpdateTenantStatus, type Tenant } from '@/api/modules/platform'
import { useTranslation } from 'react-i18next'

export const TenantPage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<Tenant>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const { t } = useTranslation(['tenant', 'common'])

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTenant(id),
    onSuccess: () => {
      message.success(t('common:deleteSuccess'))
      actionRef.current?.reload()
    },
  })

  const batchDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => batchDeleteTenants(ids),
    onSuccess: () => {
      message.success(t('common:batchDeleteSuccess'))
      setSelectedRowKeys([])
      actionRef.current?.reload()
    },
  })

  const batchStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: number }) =>
      batchUpdateTenantStatus(ids, status),
    onSuccess: (_, { status }) => {
      message.success(status === 1 ? t('common:batchEnableSuccess') : t('common:batchDisableSuccess'))
      setSelectedRowKeys([])
      actionRef.current?.reload()
    },
  })

  const submitMutation = useMutation({
    mutationFn: (payload: { record?: Tenant; values: Record<string, unknown> }) => {
      const { record, values } = payload
      return record ? updateTenant(record.id, values) : createTenant(values)
    },
    onSuccess: (_, { record }) => {
      message.success(record ? t('common:updateSuccess') : t('common:createSuccess'))
      actionRef.current?.reload()
    },
  })

  const handleAdd = () => {
    setCurrentRecord(undefined)
    setEditModalOpen(true)
  }

  const handleEdit = (record: Tenant) => {
    setCurrentRecord(record)
    setEditModalOpen(true)
  }

  const columns: ProColumns<Tenant>[] = [
    { title: t('common:id'), dataIndex: 'id', key: 'id', width: 60, search: false },
    { title: t('tenant:tenantName'), dataIndex: 'name', key: 'name', width: 160, ellipsis: true },
    { title: t('tenant:tenantCode'), dataIndex: 'code', key: 'code', width: 120, search: false, ellipsis: true },
    { title: t('tenant:contact'), dataIndex: 'contact', key: 'contact', width: 100, search: false },
    { title: t('tenant:contactPhone'), dataIndex: 'phone', key: 'phone', width: 130, search: false },
    { title: t('common:email'), dataIndex: 'email', key: 'email', width: 180, search: false, ellipsis: true },
    {
      title: t('common:status'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      valueType: 'select',
      valueEnum: {
        1: { text: t('common:enabled'), status: 'Success' },
        0: { text: t('common:disabled'), status: 'Error' },
      },
      render: (_: unknown, record: Tenant) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>
          {record.status === 1 ? t('common:enabled') : t('common:disabled')}
        </Tag>
      ),
    },
    { title: t('common:createTime'), dataIndex: 'createdAt', key: 'createdAt', valueType: 'dateTime', width: 170, search: false },
    {
      title: t('common:operation'),
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_: unknown, record: Tenant) => {
        const getTenantUrl = () => {
          const path = `/tenant-admin/${record.id}?name=${encodeURIComponent(record.name)}`
          if (import.meta.env.MODE === 'demo') {
            return `${import.meta.env.VITE_BASE_PATH || ''}/#${path}`
          }
          return `${import.meta.env.VITE_BASE_PATH || ''}${path}`
        }

        return [
          <a key="backend" onClick={() => window.open(getTenantUrl(), '_blank')}>{t('tenant:backend')}</a>,
          <HasPermission key="edit" code="tenant:edit">
            <a onClick={() => handleEdit(record)}>{t('common:edit')}</a>
          </HasPermission>,
          <HasPermission key="delete" code="tenant:delete">
            <Popconfirm title={t('common:confirmDelete')} onConfirm={() => deleteMutation.mutate(record.id)}>
              <a style={{ color: '#ff4d4f' }}>{t('common:delete')}</a>
            </Popconfirm>
          </HasPermission>,
        ]
      },
    },
  ]

  return (
    <PageContainer title={t('tenant:title')}>
      <ProTable<Tenant>
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const result = await getTenantList({
            ...params,
            pageNum: params.current,
            pageSize: params.pageSize,
          })
          return {
            data: result.list,
            success: true,
            total: result.total,
          }
        }}
        rowKey="id"
        scroll={{ x: 1100 }}
        search={{
          labelWidth: 'auto',
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as number[]),
        }}
        tableAlertRender={({ selectedRowKeys: keys, onCleanSelected }) => [
          <span key="text">{t('common:selected', { count: keys.length })}</span>,
          <a key="cancel" onClick={onCleanSelected}>{t('common:cancelSelect')}</a>,
        ]}
        tableAlertOptionRender={({ onCleanSelected }) => [
          <HasPermission key="enable" code="tenant:edit">
            <a onClick={() => { batchStatusMutation.mutate({ ids: selectedRowKeys, status: 1 }); onCleanSelected() }}>{t('common:batchEnable')}</a>
          </HasPermission>,
          <HasPermission key="disable" code="tenant:edit">
            <a onClick={() => { batchStatusMutation.mutate({ ids: selectedRowKeys, status: 0 }); onCleanSelected() }}>{t('common:batchDisable')}</a>
          </HasPermission>,
          <HasPermission key="delete" code="tenant:delete">
            <Popconfirm
              title={t('tenant:confirmDeleteTenant', { count: selectedRowKeys.length })}
              onConfirm={() => { batchDeleteMutation.mutate(selectedRowKeys); onCleanSelected() }}
            >
              <a style={{ color: '#ff4d4f' }}>{t('common:batchDelete')}</a>
            </Popconfirm>
          </HasPermission>,
        ]}
        toolBarRender={() => [
          <HasPermission key="add" code="tenant:create">
            <Button type="primary" onClick={handleAdd}>
              {t('tenant:addTenant')}
            </Button>
          </HasPermission>,
        ]}
      />

      <FormContainer
        title={currentRecord ? t('tenant:editTenant') : t('tenant:addTenant')}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialValues={currentRecord}
        onFinish={async (values) => {
          await submitMutation.mutateAsync({ record: currentRecord, values })
          return true
        }}
      >
        <ProFormText
          name="name"
          label={t('tenant:tenantName')}
          rules={[{ required: true, message: t('tenant:enterTenantName') }]}
        />
        <ProFormText
          name="code"
          label={t('tenant:tenantCode')}
          rules={[{ required: true, message: t('tenant:enterTenantCode') }]}
          disabled={!!currentRecord}
        />
        <ProFormText
          name="contact"
          label={t('tenant:contact')}
        />
        <ProFormText
          name="phone"
          label={t('tenant:contactPhone')}
        />
        <ProFormText
          name="email"
          label={t('common:email')}
        />
        <ProFormTextArea
          name="address"
          label={t('common:address')}
        />
        <ProFormSelect
          name="status"
          label={t('common:status')}
          initialValue={1}
          options={[
            { label: t('common:enabled'), value: 1 },
            { label: t('common:disabled'), value: 0 },
          ]}
        />
      </FormContainer>
    </PageContainer>
  )
}
