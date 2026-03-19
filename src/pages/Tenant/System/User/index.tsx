import { Button, Dropdown, Popconfirm, Tag, message } from 'antd'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { ProFormText, ProFormSelect, ProFormCheckbox } from '@ant-design/pro-components'
import { useMutation } from '@tanstack/react-query'
import { ProTable } from '@/components/common/ProTable'
import { PageContainer } from '@/components/common/PageContainer'
import { FormContainer } from '@/components/common/FormContainer'
import { HasPermission } from '@/components/common/HasPermission'
import { PermissionTreePanel } from '@/components/common/PermissionTreePanel'
import {
  getTenantAuthUserList,
  createTenantAuthUser,
  updateTenantAuthUser,
  deleteTenantAuthUser,
  type TenantAuthUser,
  type TenantClientType,
} from '@/api/modules/tenant'
import { useTenantSystemRolesQuery, useTenantMenuTreeQuery } from '../hooks'
import {
  convertMenuToTreeData,
  getAllTreeKeys,
  filterTreeByCheckedKeys,
} from '@/services/role.service'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const clientOptions = [
  { label: '后台端', value: 'admin' },
  { label: '小程序端', value: 'miniapp' },
]

const clientLabel: Record<TenantClientType, string> = {
  admin: '后台端',
  miniapp: '小程序端',
}

/** 将租户菜单树转换为 role.service 兼容的格式 */
function convertTenantMenuToRoleServiceFormat(menus: any[]): any[] {
  return menus.map((m) => ({
    id: m.id,
    name: m.name,
    children: m.children ? convertTenantMenuToRoleServiceFormat(m.children) : [],
  }))
}

export const TenantUserPage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<TenantAuthUser>()
  const [permissionDrawerOpen, setPermissionDrawerOpen] = useState(false)
  const [permissionMenuKeys, setPermissionMenuKeys] = useState<number[]>([])
  const [permissionUserName, setPermissionUserName] = useState('')
  const [permissionClientType, setPermissionClientType] = useState<TenantClientType>('admin')
  const [expandedMenuKeys, setExpandedMenuKeys] = useState<number[]>([])
  const [menuAllExpanded, setMenuAllExpanded] = useState(true)
  const [menuSearch, setMenuSearch] = useState('')
  const { t } = useTranslation(['system', 'common'])

  const { data: roles = [] } = useTenantSystemRolesQuery()
  const roleOptions = roles.map((r) => ({ label: r.name, value: r.id }))
  const { data: adminMenuTree = [] } = useTenantMenuTreeQuery('admin')
  const { data: miniappMenuTree = [] } = useTenantMenuTreeQuery('miniapp')

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTenantAuthUser(id),
    onSuccess: () => {
      message.success(t('common:deleteSuccess'))
      actionRef.current?.reload()
    },
  })

  const submitMutation = useMutation({
    mutationFn: (payload: { record?: TenantAuthUser; values: Record<string, unknown> }) => {
      const { record, values } = payload
      return record ? updateTenantAuthUser(record.id, values as any) : createTenantAuthUser(values as any)
    },
    onSuccess: (_, { record }) => {
      message.success(record ? t('common:updateSuccess') : t('common:createSuccess'))
      actionRef.current?.reload()
    },
  })

  const handleEdit = (record?: TenantAuthUser) => {
    setCurrentRecord(record)
    setEditModalOpen(true)
  }

  const handleViewPermission = (record: TenantAuthUser, clientType: TenantClientType) => {
    const userRoleIds = record.roleIds || []
    const mergedMenuIds = new Set<number>()
    for (const role of roles) {
      if (userRoleIds.includes(role.id)) {
        const menuIds = clientType === 'admin' ? (role.adminMenuIds || []) : (role.miniappMenuIds || [])
        for (const menuId of menuIds) {
          mergedMenuIds.add(menuId)
        }
      }
    }
    const menuTree = clientType === 'admin' ? adminMenuTree : miniappMenuTree
    const menuServiceData = convertTenantMenuToRoleServiceFormat(menuTree)
    setPermissionMenuKeys(Array.from(mergedMenuIds))
    setPermissionUserName(record.nickname || record.username)
    setPermissionClientType(clientType)
    setExpandedMenuKeys(getAllTreeKeys(convertMenuToTreeData(menuServiceData, '')))
    setMenuAllExpanded(true)
    setMenuSearch('')
    setPermissionDrawerOpen(true)
  }

  const getPermissionMenuTree = () => {
    const menuTree = permissionClientType === 'admin' ? adminMenuTree : miniappMenuTree
    return convertTenantMenuToRoleServiceFormat(menuTree)
  }

  const columns: ProColumns<TenantAuthUser>[] = [
    { title: t('common:id'), dataIndex: 'id', width: 80, search: false },
    { title: t('common:username'), dataIndex: 'username', width: 120 },
    { title: t('common:nickname'), dataIndex: 'nickname', width: 120 },
    { title: t('system:user.role'), dataIndex: 'roleNames', width: 200, search: false, render: (_, record) => record.roleNames.join(', ') },
    {
      title: '端类型',
      dataIndex: 'enabledClients',
      width: 170,
      search: false,
      render: (_, record) => (
        <>
          {record.enabledClients.map((client) => (
            <Tag key={client} color={client === 'admin' ? 'blue' : 'purple'}>
              {clientLabel[client]}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: t('common:status'),
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        1: { text: t('common:enabled'), status: 'Success' },
        0: { text: t('common:disabled'), status: 'Error' },
      },
      render: (_: unknown, record: TenantAuthUser) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>
          {record.status === 1 ? t('common:enabled') : t('common:disabled')}
        </Tag>
      ),
    },
    { title: t('common:createTime'), dataIndex: 'createdAt', valueType: 'dateTime', width: 170, search: false },
    {
      title: t('common:operation'),
      valueType: 'option',
      width: 200,
      render: (_: unknown, record: TenantAuthUser) => [
        <HasPermission key="edit" code="tenant:list:backend:system:user:update">
          <a onClick={() => handleEdit(record)}>{t('common:edit')}</a>
        </HasPermission>,
        <Dropdown
          key="viewPerm"
          trigger={['click']}
          menu={{
            items: [
              { key: 'admin', label: '后台端权限' },
              { key: 'miniapp', label: '小程序端权限' },
            ],
            onClick: ({ key }) => handleViewPermission(record, key as TenantClientType),
          }}
        >
          <a>{t('system:user.viewPermission')}</a>
        </Dropdown>,
        <HasPermission key="delete" code="tenant:list:backend:system:user:delete">
          <Popconfirm title={t('system:user.confirmDeleteUser')} onConfirm={() => deleteMutation.mutate(record.id)}>
            <a style={{ color: '#ff4d4f' }}>{t('common:delete')}</a>
          </Popconfirm>
        </HasPermission>,
      ],
    },
  ]

  return (
    <PageContainer title={t('system:user.title')}>
      <ProTable<TenantAuthUser>
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const result = await getTenantAuthUserList({
            pageNum: params.current,
            pageSize: params.pageSize,
            keyword: params.username || params.nickname,
            status: params.status,
          })
          return { data: result.list, success: true, total: result.total }
        }}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <HasPermission key="add" code="tenant:list:backend:system:user:create">
            <Button type="primary" onClick={() => handleEdit()}>
              {t('system:user.addUser')}
            </Button>
          </HasPermission>,
        ]}
      />

      <FormContainer
        title={currentRecord ? t('system:user.editUser') : t('system:user.addUser')}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialValues={currentRecord || { status: 1, enabledClients: ['admin'] }}
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
        <ProFormSelect name="roleIds" label={t('system:user.role')} mode="multiple" options={roleOptions} rules={[{ required: true }]} />
        <ProFormCheckbox.Group name="enabledClients" label="启用客户端" options={clientOptions} />
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

      {/* 权限预览 */}
      <FormContainer
        title={`${t('system:user.viewPermissionTitle', { name: permissionUserName })} - ${clientLabel[permissionClientType]}`}
        open={permissionDrawerOpen}
        onOpenChange={setPermissionDrawerOpen}
        submitter={false}
        drawerProps={{ className: 'permission-view-drawer', styles: { body: { display: 'flex', flexDirection: 'column', overflow: 'hidden' } } }}
        modalProps={{ className: 'permission-view-modal', styles: { body: { display: 'flex', flexDirection: 'column', overflow: 'hidden' } } }}
      >
        <style>{`
          .permission-view-drawer .ant-drawer-body > form,
          .permission-view-modal .ant-modal-body > form {
            display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden;
          }
        `}</style>
        <PermissionTreePanel
          readonly
          treeData={filterTreeByCheckedKeys(convertMenuToTreeData(getPermissionMenuTree(), menuSearch), new Set(permissionMenuKeys))}
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
            const allKeys = getAllTreeKeys(filterTreeByCheckedKeys(convertMenuToTreeData(getPermissionMenuTree(), menuSearch), new Set(permissionMenuKeys)))
            setExpandedMenuKeys(menuAllExpanded ? [] : allKeys)
            setMenuAllExpanded(!menuAllExpanded)
          }}
          emptyText={t('system:role.noMenuData')}
        />
      </FormContainer>
    </PageContainer>
  )
}
