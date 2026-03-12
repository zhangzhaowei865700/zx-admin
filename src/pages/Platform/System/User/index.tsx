import { Button, Popconfirm, Space, Tag, message } from 'antd'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { ProFormText, ProFormSelect } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { ProTable } from '@/components/common/ProTable'
import { PageContainer } from '@/components/common/PageContainer'
import { FormContainer } from '@/components/common/FormContainer'
import { HasPermission } from '@/components/common/HasPermission'
import { PermissionTreePanel } from '@/components/common/PermissionTreePanel'
import {
  getUserList,
  createUser,
  updateUser,
  deleteUser,
  batchDeleteUsers,
  batchUpdateUserStatus,
  resetUserPassword,
  type SystemUser,
} from '@/api/modules/platform'
import { useSystemRolesQuery } from '../hooks'
import { useMenuTreeQuery } from '../hooks/useRole'
import { convertMenuToTreeData, getAllTreeKeys, filterTreeByCheckedKeys } from '@/services/role.service'
import { useRef, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const UserPage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [resetPwdModalOpen, setResetPwdModalOpen] = useState(false)
  const [permissionDrawerOpen, setPermissionDrawerOpen] = useState(false)
  const [permissionMenuKeys, setPermissionMenuKeys] = useState<number[]>([])
  const [permissionUserName, setPermissionUserName] = useState('')
  const [currentRecord, setCurrentRecord] = useState<SystemUser>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const { t } = useTranslation(['system', 'common'])

  const { data: roles = [] } = useSystemRolesQuery()
  const roleOptions = roles.map((r) => ({ label: r.name, value: r.id }))
  const { data: menuTree = [] } = useMenuTreeQuery()

  const menuTreeData = useMemo(() => convertMenuToTreeData(menuTree, ''), [menuTree])
  const allMenuExpandedKeys = useMemo(() => getAllTreeKeys(menuTreeData), [menuTreeData])

  const [expandedMenuKeys, setExpandedMenuKeys] = useState<number[]>([])
  const [menuAllExpanded, setMenuAllExpanded] = useState(true)
  const [menuSearch, setMenuSearch] = useState('')

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

  const handleViewPermission = (record: SystemUser) => {
    const userRoleIds = record.roleIds || []
    const mergedMenuIds = new Set<number>()
    for (const role of roles) {
      if (userRoleIds.includes(role.id) && role.menuIds) {
        for (const menuId of role.menuIds) {
          mergedMenuIds.add(menuId)
        }
      }
    }
    setPermissionMenuKeys(Array.from(mergedMenuIds))
    setPermissionUserName(record.nickname || record.username)
    setExpandedMenuKeys(allMenuExpandedKeys)
    setMenuAllExpanded(true)
    setMenuSearch('')
    setPermissionDrawerOpen(true)
  }

  const columns: ProColumns<SystemUser>[] = [
    { title: t('common:id'), dataIndex: 'id', width: 80, search: false },
    { title: t('common:username'), dataIndex: 'username', width: 120 },
    { title: t('common:nickname'), dataIndex: 'nickname', width: 120 },
    { title: t('common:phone'), dataIndex: 'phone', width: 130 },
    { title: t('common:email'), dataIndex: 'email', width: 180, search: false },
    { title: t('system:user.role'), dataIndex: 'roleNames', width: 200, search: false, render: (_, record) => record.roleNames?.join(', ') || '-' },
    {
      title: t('common:status'),
      dataIndex: 'status',
      width: 100,
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
    { title: t('common:createTime'), dataIndex: 'createdAt', valueType: 'dateTime', width: 170, search: false },
    {
      title: t('common:operation'),
      valueType: 'option',
      width: 250,
      render: (_: unknown, record: SystemUser) => [
        <HasPermission key="edit" code="system:user:edit">
          <a onClick={() => handleEdit(record)}>{t('common:edit')}</a>
        </HasPermission>,
        <a key="viewPerm" onClick={() => handleViewPermission(record)}>{t('system:user.viewPermission')}</a>,
        <HasPermission key="reset" code="system:user:resetPwd">
          <a onClick={() => handleResetPwd(record)}>{t('system:user.resetPassword')}</a>
        </HasPermission>,
        <HasPermission key="delete" code="system:user:delete">
          <Popconfirm title={t('system:user.confirmDeleteUser')} onConfirm={() => deleteMutation.mutate(record.id)}>
            <a style={{ color: '#ff4d4f' }}>{t('common:delete')}</a>
          </Popconfirm>
        </HasPermission>,
      ],
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
            <HasPermission key="enable" code="system:user:edit">
              <a onClick={() => { batchStatusMutation.mutate({ ids: selectedRowKeys, status: 1 }); onCleanSelected() }}>{t('common:batchEnable')}</a>
            </HasPermission>
            <HasPermission key="disable" code="system:user:edit">
              <a onClick={() => { batchStatusMutation.mutate({ ids: selectedRowKeys, status: 0 }); onCleanSelected() }}>{t('common:batchDisable')}</a>
            </HasPermission>
            <HasPermission key="delete" code="system:user:delete">
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
        <ProFormSelect name="roleIds" label={t('system:user.role')} mode="multiple" options={roleOptions} />
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

      {/* 权限预览 */}
      <FormContainer
        title={t('system:user.viewPermissionTitle', { name: permissionUserName })}
        open={permissionDrawerOpen}
        onOpenChange={setPermissionDrawerOpen}
        submitter={false}
        drawerProps={{ styles: { body: { display: 'flex', flexDirection: 'column', overflow: 'hidden' } } }}
        modalProps={{ styles: { body: { display: 'flex', flexDirection: 'column', overflow: 'hidden' } } }}
      >
        <PermissionTreePanel
          readonly
          treeData={filterTreeByCheckedKeys(convertMenuToTreeData(menuTree, menuSearch), new Set(permissionMenuKeys))}
          checkedKeys={permissionMenuKeys}
          expandedKeys={expandedMenuKeys}
          allExpanded={menuAllExpanded}
          searchValue={menuSearch}
          searchPlaceholder={t('system:role.searchMenu')}
          onSearchChange={setMenuSearch}
          onCheckedChange={() => {}}
          onExpandedChange={(keys) => setExpandedMenuKeys(keys)}
          onSelectAll={() => {}}
          onClear={() => {}}
          onToggleExpand={() => {
            const allKeys = getAllTreeKeys(filterTreeByCheckedKeys(convertMenuToTreeData(menuTree, menuSearch), new Set(permissionMenuKeys)))
            setExpandedMenuKeys(menuAllExpanded ? [] : allKeys)
            setMenuAllExpanded(!menuAllExpanded)
          }}
          emptyText={t('system:role.noMenuData')}
        />
      </FormContainer>
    </PageContainer>
  )
}
