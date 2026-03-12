import { Button, Popconfirm, Space, Tag, Tabs, Dropdown } from 'antd'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-components'
import { ProTable } from '@/components/common/ProTable'
import { PageContainer } from '@/components/common/PageContainer'
import { FormContainer } from '@/components/common/FormContainer'
import { PermissionTreePanel } from '@/components/common/PermissionTreePanel'
import { HasPermission } from '@/components/common/HasPermission'
import { getTenantAuthRoleList, type TenantAuthRole, type TenantClientType } from '@/api/modules/tenant'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTenantMenuTreeQuery, useTenantDeptTreeQuery, useTenantRoleMutations } from '../hooks'
import {
  convertMenuToTreeData,
  convertDeptToTreeData,
  getAllLeafKeys,
  getAllTreeKeys,
  splitLeafAndParentKeys,
} from '@/services/role.service'

/** 将租户菜单树转换为 role.service 兼容的格式 */
function convertTenantMenuToRoleServiceFormat(menus: any[]): any[] {
  return menus.map((m) => ({
    id: m.id,
    name: m.name,
    children: m.children ? convertTenantMenuToRoleServiceFormat(m.children) : [],
  }))
}

/** 将租户部门树转换为 role.service 兼容的格式 */
function convertTenantDeptToRoleServiceFormat(depts: any[]): any[] {
  return depts.map((d) => ({
    id: d.id,
    name: d.name,
    children: d.children ? convertTenantDeptToRoleServiceFormat(d.children) : [],
  }))
}

export const TenantRolePage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [permissionDrawerOpen, setPermissionDrawerOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<TenantAuthRole>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [permissionClientType, setPermissionClientType] = useState<TenantClientType>('admin')
  const [checkedMenuKeys, setCheckedMenuKeys] = useState<number[]>([])
  const [checkedDeptKeys, setCheckedDeptKeys] = useState<number[]>([])
  const [halfCheckedMenuKeys, setHalfCheckedMenuKeys] = useState<number[]>([])
  const [halfCheckedDeptKeys, setHalfCheckedDeptKeys] = useState<number[]>([])
  const [menuSearch, setMenuSearch] = useState('')
  const [deptSearch, setDeptSearch] = useState('')
  const [expandedMenuKeys, setExpandedMenuKeys] = useState<number[]>([])
  const [expandedDeptKeys, setExpandedDeptKeys] = useState<number[]>([])
  const [menuAllExpanded, setMenuAllExpanded] = useState(true)
  const [deptAllExpanded, setDeptAllExpanded] = useState(true)
  const { t } = useTranslation(['system', 'common'])

  const { data: adminMenuTree = [] } = useTenantMenuTreeQuery('admin')
  const { data: miniappMenuTree = [] } = useTenantMenuTreeQuery('miniapp')
  const { data: adminDeptTree = [] } = useTenantDeptTreeQuery('admin')
  const { data: miniappDeptTree = [] } = useTenantDeptTreeQuery('miniapp')
  const { submit, remove, batchRemove, savePermission } = useTenantRoleMutations(actionRef)

  const getMenuTree = () => permissionClientType === 'admin' ? adminMenuTree : miniappMenuTree
  const getDeptTree = () => permissionClientType === 'admin' ? adminDeptTree : miniappDeptTree
  const getMenuTreeForService = () => convertTenantMenuToRoleServiceFormat(getMenuTree())
  const getDeptTreeForService = () => convertTenantDeptToRoleServiceFormat(getDeptTree())

  const handleAdd = () => {
    setCurrentRecord(undefined)
    setEditModalOpen(true)
  }

  const handleEdit = (record: TenantAuthRole) => {
    setCurrentRecord(record)
    setEditModalOpen(true)
  }

  const handlePermission = (record: TenantAuthRole, clientType: TenantClientType) => {
    setCurrentRecord(record)
    setPermissionClientType(clientType)
    const menuTree = clientType === 'admin' ? adminMenuTree : miniappMenuTree
    const deptTree = clientType === 'admin' ? adminDeptTree : miniappDeptTree
    const menuIds = clientType === 'admin' ? (record.adminMenuIds || []) : (record.miniappMenuIds || [])
    const deptIds = clientType === 'admin' ? (record.adminDeptIds || []) : (record.miniappDeptIds || [])
    const menuServiceData = convertTenantMenuToRoleServiceFormat(menuTree)
    const deptServiceData = convertTenantDeptToRoleServiceFormat(deptTree)
    const menuTreeData = convertMenuToTreeData(menuServiceData, '')
    const deptTreeData = convertDeptToTreeData(deptServiceData, '')
    const menuSplit = splitLeafAndParentKeys(menuTreeData, menuIds)
    const deptSplit = splitLeafAndParentKeys(deptTreeData, deptIds)
    setCheckedMenuKeys(menuSplit.leafKeys)
    setHalfCheckedMenuKeys(menuSplit.parentKeys)
    setCheckedDeptKeys(deptSplit.leafKeys)
    setHalfCheckedDeptKeys(deptSplit.parentKeys)
    setExpandedMenuKeys(getAllTreeKeys(menuTreeData))
    setExpandedDeptKeys(getAllTreeKeys(deptTreeData))
    setMenuAllExpanded(true)
    setDeptAllExpanded(true)
    setMenuSearch('')
    setDeptSearch('')
    setPermissionDrawerOpen(true)
  }

  const handleMenuSelectAll = (checked: boolean) => {
    setCheckedMenuKeys(checked ? getAllLeafKeys(convertMenuToTreeData(getMenuTreeForService(), menuSearch)) as number[] : [])
    setHalfCheckedMenuKeys([])
  }

  const handleDeptSelectAll = (checked: boolean) => {
    setCheckedDeptKeys(checked ? getAllLeafKeys(convertDeptToTreeData(getDeptTreeForService(), deptSearch)) as number[] : [])
    setHalfCheckedDeptKeys([])
  }

  const handleToggleExpand = (type: 'menu' | 'dept') => {
    const isExpanded = type === 'menu' ? menuAllExpanded : deptAllExpanded
    const treeData =
      type === 'menu'
        ? convertMenuToTreeData(getMenuTreeForService(), menuSearch)
        : convertDeptToTreeData(getDeptTreeForService(), deptSearch)
    const allKeys = getAllTreeKeys(treeData)
    if (type === 'menu') {
      setExpandedMenuKeys(isExpanded ? [] : allKeys)
      setMenuAllExpanded(!isExpanded)
    } else {
      setExpandedDeptKeys(isExpanded ? [] : allKeys)
      setDeptAllExpanded(!isExpanded)
    }
  }

  const clientTypeLabel = permissionClientType === 'admin' ? '后台端' : '小程序端'

  const columns: ProColumns<TenantAuthRole>[] = [
    { title: t('common:id'), dataIndex: 'id', width: 80, search: false },
    { title: t('system:role.roleName'), dataIndex: 'name', width: 150 },
    { title: t('system:role.roleCode'), dataIndex: 'code', width: 150 },
    { title: t('common:description'), dataIndex: 'description', width: 200, search: false, ellipsis: true },
    {
      title: t('common:status'),
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        1: { text: t('common:enabled'), status: 'Success' },
        0: { text: t('common:disabled'), status: 'Error' },
      },
      render: (_: unknown, record: TenantAuthRole) => (
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
      render: (_: unknown, record: TenantAuthRole) => [
        <HasPermission key="edit" code="tenant:admin:auth:role:update">
          <a onClick={() => handleEdit(record)}>{t('common:edit')}</a>
        </HasPermission>,
        <HasPermission key="permission" code="tenant:admin:auth:role:update">
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'admin', label: '后台端权限' },
                { key: 'miniapp', label: '小程序端权限' },
              ],
              onClick: ({ key }) => handlePermission(record, key as TenantClientType),
            }}
          >
            <a>{t('system:role.configPermission')}</a>
          </Dropdown>
        </HasPermission>,
        <HasPermission key="delete" code="tenant:admin:auth:role:delete">
          <Popconfirm
            title={t('system:role.confirmDeleteRole')}
            onConfirm={() => remove.mutate(record.id)}
          >
            <a style={{ color: '#ff4d4f' }}>{t('common:delete')}</a>
          </Popconfirm>
        </HasPermission>,
      ],
    },
  ]

  return (
    <PageContainer title={t('system:role.title')}>
      <ProTable<TenantAuthRole>
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const result = await getTenantAuthRoleList({
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
            <HasPermission key="delete" code="tenant:admin:auth:role:delete">
              <Popconfirm
                title={t('system:role.confirmDeleteRoles', { count: selectedRowKeys.length })}
                onConfirm={() => {
                  batchRemove.mutate(selectedRowKeys)
                  setSelectedRowKeys([])
                  onCleanSelected()
                }}
              >
                <a style={{ color: '#ff4d4f' }}>{t('common:batchDelete')}</a>
              </Popconfirm>
            </HasPermission>
          </Space>
        )}
        toolBarRender={() => [
          <HasPermission key="add" code="tenant:admin:auth:role:create">
            <Button type="primary" onClick={handleAdd}>
              {t('system:role.addRole')}
            </Button>
          </HasPermission>,
        ]}
      />

      {/* 新增/编辑角色基本信息 */}
      <FormContainer
        title={currentRecord ? t('system:role.editRole') : t('system:role.addRole')}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialValues={currentRecord}
        onFinish={async (values) => {
          await submit.mutateAsync({ record: currentRecord, values })
          return true
        }}
      >
        <ProFormText
          name="name"
          label={t('system:role.roleName')}
          rules={[{ required: true, message: t('system:role.enterRoleName') }]}
        />
        <ProFormText
          name="code"
          label={t('system:role.roleCode')}
          rules={[{ required: true, message: t('system:role.enterRoleCode') }]}
          disabled={!!currentRecord}
        />
        <ProFormTextArea name="description" label={t('common:description')} />
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

      {/* 配置权限 */}
      <FormContainer
        title={`${t('system:role.configPermission')} - ${currentRecord?.name || ''} - ${clientTypeLabel}`}
        open={permissionDrawerOpen}
        onOpenChange={setPermissionDrawerOpen}
        drawerProps={{
          className: 'permission-config-drawer',
          styles: { body: { display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
        }}
        onFinish={async () => {
          await savePermission.mutateAsync({
            roleId: currentRecord!.id,
            clientType: permissionClientType,
            menuIds: [...checkedMenuKeys, ...halfCheckedMenuKeys],
            deptIds: [...checkedDeptKeys, ...halfCheckedDeptKeys],
          })
          return true
        }}
      >
        <>
          <style>{`
            .permission-config-drawer .ant-drawer-body > form {
              display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden;
            }
            .permission-config-drawer .ant-tabs {
              display: flex; flex-direction: column; flex: 1; min-height: 0;
            }
            .permission-config-drawer .ant-tabs-content-holder {
              flex: 1; overflow: hidden; display: flex; flex-direction: column; min-height: 0;
            }
            .permission-config-drawer .ant-tabs-content {
              flex: 1; overflow: hidden; display: flex; flex-direction: column; min-height: 0;
            }
            .permission-config-drawer .ant-tabs-tabpane {
              flex: 1; display: flex; flex-direction: column; overflow: hidden;
            }
            .permission-config-drawer .ant-tabs-tabpane-hidden { display: none; }
          `}</style>
          <Tabs
            style={{ flex: 1, minHeight: 0 }}
            items={[
              {
                key: 'menu',
                label: (
                  <span>
                    {t('system:role.menuPermission')}
                    {checkedMenuKeys.length > 0 && (
                      <Tag color="blue" style={{ marginLeft: 8 }}>
                        {checkedMenuKeys.length}
                      </Tag>
                    )}
                  </span>
                ),
                children: (
                  <PermissionTreePanel
                    treeData={convertMenuToTreeData(getMenuTreeForService(), menuSearch)}
                    checkedKeys={checkedMenuKeys}
                    expandedKeys={expandedMenuKeys}
                    allExpanded={menuAllExpanded}
                    searchValue={menuSearch}
                    searchPlaceholder={t('system:role.searchMenu')}
                    onSearchChange={setMenuSearch}
                    onCheckedChange={setCheckedMenuKeys}
                    onHalfCheckedChange={setHalfCheckedMenuKeys}
                    onExpandedChange={(keys) => setExpandedMenuKeys(keys)}
                    onSelectAll={handleMenuSelectAll}
                    onClear={() => { setCheckedMenuKeys([]); setHalfCheckedMenuKeys([]) }}
                    onToggleExpand={() => handleToggleExpand('menu')}
                    emptyText={t('system:role.noMenuData')}
                  />
                ),
              },
              {
                key: 'data',
                label: (
                  <span>
                    {t('system:role.dataPermission')}
                    {checkedDeptKeys.length > 0 && (
                      <Tag color="blue" style={{ marginLeft: 8 }}>
                        {checkedDeptKeys.length}
                      </Tag>
                    )}
                  </span>
                ),
                children: (
                  <PermissionTreePanel
                    treeData={convertDeptToTreeData(getDeptTreeForService(), deptSearch)}
                    checkedKeys={checkedDeptKeys}
                    expandedKeys={expandedDeptKeys}
                    allExpanded={deptAllExpanded}
                    searchValue={deptSearch}
                    searchPlaceholder={t('system:role.searchDept')}
                    onSearchChange={setDeptSearch}
                    onCheckedChange={setCheckedDeptKeys}
                    onHalfCheckedChange={setHalfCheckedDeptKeys}
                    onExpandedChange={(keys) => setExpandedDeptKeys(keys)}
                    onSelectAll={handleDeptSelectAll}
                    onClear={() => { setCheckedDeptKeys([]); setHalfCheckedDeptKeys([]) }}
                    onToggleExpand={() => handleToggleExpand('dept')}
                    emptyText={t('system:role.noDeptData')}
                  />
                ),
              },
            ]}
          />
        </>
      </FormContainer>
    </PageContainer>
  )
}
