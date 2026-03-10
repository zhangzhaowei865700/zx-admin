import { Button, Popconfirm, Tag, Tabs, Input, Checkbox, Tree, theme } from 'antd'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-components'
import type { DataNode } from 'antd/es/tree'
import { ProTable } from '@/components/common/ProTable'
import { PageContainer } from '@/components/common/PageContainer'
import { FormContainer } from '@/components/common/FormContainer'
import { getRoleList, type Role } from '@/api/modules/platform'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMenuTreeQuery, useDeptTreeQuery, useRoleMutations } from '../hooks/useRole'
import {
  convertMenuToTreeData,
  convertDeptToTreeData,
  getAllLeafKeys,
  getAllTreeKeys,
} from '@/services/role.service'

interface PermissionTreePanelProps {
  treeData: DataNode[]
  checkedKeys: number[]
  expandedKeys: number[]
  allExpanded: boolean
  searchValue: string
  searchPlaceholder: string
  onSearchChange: (v: string) => void
  onCheckedChange: (keys: number[]) => void
  onExpandedChange: (keys: number[]) => void
  onSelectAll: (checked: boolean) => void
  onClear: () => void
  onToggleExpand: () => void
  emptyText: string
}

const PermissionTreePanel: React.FC<PermissionTreePanelProps> = ({
  treeData,
  checkedKeys,
  expandedKeys,
  allExpanded,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onCheckedChange,
  onExpandedChange,
  onSelectAll,
  onClear,
  onToggleExpand,
  emptyText,
}) => {
  const { token } = theme.useToken()
  const { t } = useTranslation('common')

  const allLeafCount = getAllLeafKeys(treeData).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden', gap: 8 }}>
      {/* 工具栏 */}
      <div
        style={{
          flexShrink: 0,
          padding: '8px 12px',
          background: token.colorFillAlter,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusSM,
          display: 'flex',
          gap: 6,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          size="small"
          style={{ width: 170, flex: '0 0 auto' }}
        />
        <div style={{ width: 1, height: 16, background: token.colorBorderSecondary, flexShrink: 0 }} />
        <Checkbox
          checked={checkedKeys.length > 0}
          indeterminate={checkedKeys.length > 0 && checkedKeys.length < allLeafCount}
          onChange={(e) => onSelectAll(e.target.checked)}
        >
          <span style={{ fontSize: 13 }}>{t('selectAll')}</span>
        </Checkbox>
        <Button type="link" size="small" style={{ padding: '0 4px' }} onClick={onClear}>
          {t('clear')}
        </Button>
        <Button type="link" size="small" style={{ padding: '0 4px' }} onClick={onToggleExpand}>
          {allExpanded ? t('collapse') : t('expand')}
        </Button>
      </div>

      {/* 树容器 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          minHeight: 0,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusSM,
          padding: '6px 4px',
          background: token.colorBgContainer,
          display: 'flex',
          alignItems: treeData.length === 0 ? 'center' : undefined,
          justifyContent: treeData.length === 0 ? 'center' : undefined,
        }}
      >
        {treeData.length === 0 ? (
          <span style={{ color: token.colorTextDisabled }}>{emptyText}</span>
        ) : (
          <Tree
            checkable
            expandedKeys={expandedKeys}
            onExpand={(keys) => onExpandedChange(keys as number[])}
            checkedKeys={checkedKeys}
            onCheck={(keys) => onCheckedChange(keys as number[])}
            treeData={treeData}
          />
        )}
      </div>
    </div>
  )
}

export const RolePage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [permissionDrawerOpen, setPermissionDrawerOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<Role>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [checkedMenuKeys, setCheckedMenuKeys] = useState<number[]>([])
  const [checkedDeptKeys, setCheckedDeptKeys] = useState<number[]>([])
  const [menuSearch, setMenuSearch] = useState('')
  const [deptSearch, setDeptSearch] = useState('')
  const [expandedMenuKeys, setExpandedMenuKeys] = useState<number[]>([])
  const [expandedDeptKeys, setExpandedDeptKeys] = useState<number[]>([])
  const [menuAllExpanded, setMenuAllExpanded] = useState(true)
  const [deptAllExpanded, setDeptAllExpanded] = useState(true)
  const { t } = useTranslation(['system', 'common'])

  const { data: menuTree = [] } = useMenuTreeQuery()
  const { data: deptTree = [] } = useDeptTreeQuery()
  const { submit, remove, batchRemove, savePermission } = useRoleMutations(actionRef)

  const handleAdd = () => {
    setCurrentRecord(undefined)
    setCheckedMenuKeys([])
    setCheckedDeptKeys([])
    setEditModalOpen(true)
  }

  const handleEdit = (record: Role) => {
    setCurrentRecord(record)
    setEditModalOpen(true)
  }

  const handlePermission = (record: Role) => {
    setCurrentRecord(record)
    setCheckedMenuKeys(record.menuIds || [])
    setCheckedDeptKeys(record.deptIds || [])
    setExpandedMenuKeys(getAllTreeKeys(convertMenuToTreeData(menuTree, '')))
    setExpandedDeptKeys(getAllTreeKeys(convertDeptToTreeData(deptTree, '')))
    setMenuAllExpanded(true)
    setDeptAllExpanded(true)
    setPermissionDrawerOpen(true)
  }

  const handleMenuSelectAll = (checked: boolean) => {
    setCheckedMenuKeys(checked ? getAllLeafKeys(convertMenuToTreeData(menuTree, menuSearch)) as number[] : [])
  }

  const handleDeptSelectAll = (checked: boolean) => {
    setCheckedDeptKeys(checked ? getAllLeafKeys(convertDeptToTreeData(deptTree, deptSearch)) as number[] : [])
  }

  const handleToggleExpand = (type: 'menu' | 'dept') => {
    const isExpanded = type === 'menu' ? menuAllExpanded : deptAllExpanded
    const treeData =
      type === 'menu'
        ? convertMenuToTreeData(menuTree, menuSearch)
        : convertDeptToTreeData(deptTree, deptSearch)
    const allKeys = getAllTreeKeys(treeData)
    if (type === 'menu') {
      setExpandedMenuKeys(isExpanded ? [] : allKeys)
      setMenuAllExpanded(!isExpanded)
    } else {
      setExpandedDeptKeys(isExpanded ? [] : allKeys)
      setDeptAllExpanded(!isExpanded)
    }
  }

  const columns: ProColumns<Role>[] = [
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
      render: (_: unknown, record: Role) => (
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
      render: (_: unknown, record: Role) => [
        <a key="edit" onClick={() => handleEdit(record)}>{t('common:edit')}</a>,
        <a key="permission" onClick={() => handlePermission(record)}>{t('system:role.configPermission')}</a>,
        <Popconfirm
          key="delete"
          title={t('system:role.confirmDeleteRole')}
          onConfirm={() => remove.mutate(record.id)}
        >
          <a style={{ color: '#ff4d4f' }}>{t('common:delete')}</a>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <PageContainer title={t('system:role.title')}>
      <ProTable<Role>
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const result = await getRoleList({
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
        tableAlertRender={({ selectedRowKeys: keys, onCleanSelected }) => [
          <span key="text">{t('common:selected', { count: keys.length })}</span>,
          <a key="cancel" onClick={onCleanSelected}>{t('common:cancelSelect')}</a>,
        ]}
        tableAlertOptionRender={({ onCleanSelected }) => [
          <Popconfirm
            key="delete"
            title={t('system:role.confirmDeleteRoles', { count: selectedRowKeys.length })}
            onConfirm={() => {
              batchRemove.mutate(selectedRowKeys)
              setSelectedRowKeys([])
              onCleanSelected()
            }}
          >
            <a style={{ color: '#ff4d4f' }}>{t('common:batchDelete')}</a>
          </Popconfirm>,
        ]}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={handleAdd}>
            {t('system:role.addRole')}
          </Button>,
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
        title={t('system:role.configPermissionTitle', { name: currentRecord?.name })}
        open={permissionDrawerOpen}
        onOpenChange={setPermissionDrawerOpen}
        drawerProps={{
          className: 'permission-config-drawer',
          styles: { body: { display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
        }}
        onFinish={async () => {
          await savePermission.mutateAsync({
            roleId: currentRecord!.id,
            menuIds: checkedMenuKeys,
            deptIds: checkedDeptKeys,
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
                    treeData={convertMenuToTreeData(menuTree, menuSearch)}
                    checkedKeys={checkedMenuKeys}
                    expandedKeys={expandedMenuKeys}
                    allExpanded={menuAllExpanded}
                    searchValue={menuSearch}
                    searchPlaceholder={t('system:role.searchMenu')}
                    onSearchChange={setMenuSearch}
                    onCheckedChange={setCheckedMenuKeys}
                    onExpandedChange={(keys) => setExpandedMenuKeys(keys)}
                    onSelectAll={handleMenuSelectAll}
                    onClear={() => setCheckedMenuKeys([])}
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
                    treeData={convertDeptToTreeData(deptTree, deptSearch)}
                    checkedKeys={checkedDeptKeys}
                    expandedKeys={expandedDeptKeys}
                    allExpanded={deptAllExpanded}
                    searchValue={deptSearch}
                    searchPlaceholder={t('system:role.searchDept')}
                    onSearchChange={setDeptSearch}
                    onCheckedChange={setCheckedDeptKeys}
                    onExpandedChange={(keys) => setExpandedDeptKeys(keys)}
                    onSelectAll={handleDeptSelectAll}
                    onClear={() => setCheckedDeptKeys([])}
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
