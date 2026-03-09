import { Button, Popconfirm, Space, Tag, message } from 'antd'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { ProFormText, ProFormSelect } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { ProTable } from '@/components/common/ProTable'
import { PageContainer } from '@/components/common/PageContainer'
import { FormContainer } from '@/components/common/FormContainer'
import { HasPermission } from '@/components/common/HasPermission'
import {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  batchUpdateUserStatus,
  resetUserPassword,
  type SystemUser,
} from '@/api/modules/platform/system'
import { useSystemRolesQuery } from '../hooks'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const UserPage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [resetPwdModalOpen, setResetPwdModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<SystemUser>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const { t } = useTranslation(['system', 'common'])

  const { data: roles = [] } = useSystemRolesQuery()
  const roleOptions = roles.map((r) => ({ label: r.name, value: r.id }))

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      message.success(t('common:deleteSuccess'))
      actionRef.current?.reload()
    },
  })

  const batchDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => batchDeleteUsers(ids),
    onSuccess: () => {
      message.success(t('common:batchDeleteSuccess'))
      setSelectedRowKeys([])
      actionRef.current?.reload()
    },
  })

  const batchStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: number }) =>
      batchUpdateUserStatus(ids, status),
    onSuccess: (_, { status }) => {
      message.success(status === 1 ? t('common:batchEnableSuccess') : t('common:batchDisableSuccess'))
      setSelectedRowKeys([])
      actionRef.current?.reload()
    },
  })

  const submitMutation = useMutation({
    mutationFn: (payload: { record?: SystemUser; values: Record<string, unknown> }) => {
      const { record, values } = payload
      return record ? updateUser(record.id, values) : createUser(values)
    },
    onSuccess: (_, { record }) => {
      message.success(record ? t('common:updateSuccess') : t('common:createSuccess'))
      actionRef.current?.reload()
    },
  })

  const resetPwdMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      resetUserPassword(id, password),
    onSuccess: () => {
      message.success(t('system:user.resetPasswordSuccess'))
    },
  })

  const handleEdit = (record?: SystemUser) => {
    setCurrentRecord(record)
    setEditModalOpen(true)
  }

  const handleResetPwd = (record: SystemUser) => {
    setCurrentRecord(record)
    setResetPwdModalOpen(true)
  }

  const columns: ProColumns<SystemUser>[] = [
    { title: t('common:id'), dataIndex: 'id', width: 80, search: false },
    { title: t('common:username'), dataIndex: 'username' },
    { title: t('common:nickname'), dataIndex: 'nickname' },
    { title: t('common:phone'), dataIndex: 'phone' },
    { title: t('common:email'), dataIndex: 'email', search: false },
    { title: t('system:user.role'), dataIndex: 'roleName', search: false },
    {
      title: t('common:status'),
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: t('common:enabled'), status: 'Success' },
        0: { text: t('common:disabled'), status: 'Error' },
      },
      render: (_: unknown, record: SystemUser) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>
          {record.status === 1 ? t('common:enabled') : t('common:disabled')}
        </Tag>
      ),
    },
    { title: t('common:createTime'), dataIndex: 'createdAt', valueType: 'dateTime', search: false },
    {
      title: t('common:operation'),
      valueType: 'option',
      render: (_: unknown, record: SystemUser) => (
        <Space size="middle">
          <HasPermission code="system:user:edit">
            <a onClick={() => handleEdit(record)}>{t('common:edit')}</a>
          </HasPermission>
          <HasPermission code="system:user:resetPwd">
            <a onClick={() => handleResetPwd(record)}>{t('system:user.resetPassword')}</a>
          </HasPermission>
          <HasPermission code="system:user:delete">
            <Popconfirm title={t('system:user.confirmDeleteUser')} onConfirm={() => deleteMutation.mutate(record.id)}>
              <a style={{ color: '#ff4d4f' }}>{t('common:delete')}</a>
            </Popconfirm>
          </HasPermission>
        </Space>
      ),
    },
  ]

  return (
    <PageContainer title={t('system:user.title')}>
      <ProTable<SystemUser>
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const result = await getUserList({
            ...params,
            pageNum: params.current,
            pageSize: params.pageSize,
          })
          return { data: result.list, success: true, total: result.total }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as number[]),
        }}
        tableAlertRender={({ selectedRowKeys: keys, onCleanSelected }) => (
          <Space>
            <span>{t('common:selected', { count: keys.length })}</span>
            <a onClick={onCleanSelected}>{t('common:cancelSelect')}</a>
          </Space>
        )}
        tableAlertOptionRender={({ onCleanSelected }) => (
          <Space>
            <HasPermission code="system:user:edit">
              <a onClick={() => { batchStatusMutation.mutate({ ids: selectedRowKeys, status: 1 }); onCleanSelected() }}>{t('common:batchEnable')}</a>
            </HasPermission>
            <HasPermission code="system:user:edit">
              <a onClick={() => { batchStatusMutation.mutate({ ids: selectedRowKeys, status: 0 }); onCleanSelected() }}>{t('common:batchDisable')}</a>
            </HasPermission>
            <HasPermission code="system:user:delete">
              <Popconfirm
                title={t('system:user.confirmDeleteUsers', { count: selectedRowKeys.length })}
                onConfirm={() => { batchDeleteMutation.mutate(selectedRowKeys); onCleanSelected() }}
              >
                <a style={{ color: '#ff4d4f' }}>{t('common:batchDelete')}</a>
              </Popconfirm>
            </HasPermission>
          </Space>
        )}
        toolBarRender={() => [
          <HasPermission key="add" code="system:user:create">
            <Button type="primary" onClick={() => handleEdit()}>
              {t('system:user.addUser')}
            </Button>
          </HasPermission>,
        ]}
      />

      {/* 新增/编辑弹窗 */}
      <FormContainer
        title={currentRecord ? t('system:user.editUser') : t('system:user.addUser')}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialValues={currentRecord}
        onFinish={async (values) => {
          await submitMutation.mutateAsync({ record: currentRecord, values })
          return true
        }}
      >
        <ProFormText
          name="username"
          label={t('common:username')}
          rules={[{ required: true, message: t('system:user.enterUsername') }]}
          disabled={!!currentRecord}
        />
        <ProFormText name="nickname" label={t('common:nickname')} rules={[{ required: true, message: t('common:enterNickname') }]} />
        {!currentRecord && (
          <ProFormText.Password
            name="password"
            label={t('system:user.password')}
            rules={[{ required: true, message: t('system:user.enterPassword') }]}
          />
        )}
        <ProFormText name="phone" label={t('common:phone')} />
        <ProFormText name="email" label={t('common:email')} />
        <ProFormSelect name="roleId" label={t('system:user.role')} options={roleOptions} />
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

      {/* 重置密码弹窗 */}
      <FormContainer
        title={t('system:user.resetPasswordTitle', { name: currentRecord?.username })}
        open={resetPwdModalOpen}
        onOpenChange={setResetPwdModalOpen}
        onFinish={async (values) => {
          if (currentRecord) {
            await resetPwdMutation.mutateAsync({ id: currentRecord.id, password: values.password })
          }
          return true
        }}
      >
        <ProFormText.Password
          name="password"
          label={t('system:user.newPassword')}
          rules={[{ required: true, message: t('system:user.enterNewPassword') }]}
        />
        <ProFormText.Password
          name="confirmPassword"
          label={t('system:user.confirmPassword')}
          rules={[
            { required: true, message: t('system:user.enterConfirmPassword') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(t('system:user.passwordMismatch')))
              },
            }),
          ]}
        />
      </FormContainer>
    </PageContainer>
  )
}
