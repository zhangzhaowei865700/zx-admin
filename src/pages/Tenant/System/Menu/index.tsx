import { Button, Popconfirm, Tag, Tabs } from 'antd'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import {
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormTreeSelect,
} from '@ant-design/pro-components'
import { PageContainer } from '@/components/common/PageContainer'
import { ProTable } from '@/components/common/ProTable'
import { FormContainer } from '@/components/common/FormContainer'
import { HasPermission } from '@/components/common/HasPermission'
import { type TenantAuthMenuItem, type TenantClientType } from '@/api/modules/tenant'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTenantMenuTreeQuery, useTenantMenuMutations } from './hooks/useMenu'
import {
  convertToTreeSelectData,
  buildPermissionPrefix,
  stripPermissionPrefix,
  buildPermissionValue,
} from '@/services/menu.service'

export const TenantMenuPage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [activeClient, setActiveClient] = useState<TenantClientType>('admin')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<TenantAuthMenuItem>()
  const [treeSelectData, setTreeSelectData] = useState<any[]>([])
  const [permissionPrefix, setPermissionPrefix] = useState('')
  const { t } = useTranslation(['system', 'common'])

  const { data: menuTree = [], refetch: refetchMenuTree } = useTenantMenuTreeQuery(activeClient)
  const { submit, remove } = useTenantMenuMutations(actionRef)

  const menuTypeMap: Record<number, { text: string; color: string }> = {
    1: { text: t('system:menu.typeDirectory'), color: 'blue' },
    2: { text: t('system:menu.typeMenu'), color: 'green' },
    3: { text: t('system:menu.typeButton'), color: 'orange' },
  }

  const handleEdit = async (record?: TenantAuthMenuItem, parentId?: number) => {
    const { data: menus } = await refetchMenuTree()
    const latestMenus = menus ?? menuTree
    setTreeSelectData(convertToTreeSelectData(latestMenus as any))
    if (record) {
      const prefix = buildPermissionPrefix(latestMenus as any, record.parentId)
      setPermissionPrefix(prefix)
      setCurrentRecord({
        ...record,
        permission: stripPermissionPrefix(record.permission, prefix),
      })
    } else if (parentId !== undefined) {
      const prefix = buildPermissionPrefix(latestMenus as any, parentId)
      setPermissionPrefix(prefix)
      setCurrentRecord({ parentId, clientType: activeClient } as any)
    } else {
      setPermissionPrefix('')
      setCurrentRecord(undefined)
    }
    setEditModalOpen(true)
  }

  const columns: ProColumns<TenantAuthMenuItem>[] = [
    { title: t('system:menu.menuName'), dataIndex: 'name', width: 200 },
    { title: t('system:menu.icon'), dataIndex: 'icon', width: 100 },
    { title: t('system:menu.path'), dataIndex: 'path', width: 200 },
    { title: t('system:menu.component'), dataIndex: 'component', width: 200 },
    { title: t('system:menu.permission'), dataIndex: 'permission', width: 160 },
    {
      title: t('system:menu.menuType'),
      dataIndex: 'type',
      width: 80,
      render: (_: unknown, record: TenantAuthMenuItem) => {
        const info = menuTypeMap[record.type]
        return info ? <Tag color={info.color}>{info.text}</Tag> : '-'
      },
    },
    { title: t('common:sort'), dataIndex: 'sort', width: 80 },
    {
      title: t('common:show'),
      dataIndex: 'visible',
      width: 80,
      render: (_: unknown, record: TenantAuthMenuItem) => (
        <Tag color={record.visible === 1 ? 'green' : 'red'}>
          {record.visible === 1 ? t('common:show') : t('common:hide')}
        </Tag>
      ),
    },
    {
      title: t('common:status'),
      dataIndex: 'status',
      width: 80,
      render: (_: unknown, record: TenantAuthMenuItem) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>
          {record.status === 1 ? t('common:enabled') : t('common:disabled')}
        </Tag>
      ),
    },
    {
      title: t('common:operation'),
      valueType: 'option',
      width: 200,
      render: (_: unknown, record: TenantAuthMenuItem) => [
        <HasPermission key="add" code="tenant:admin:auth:menu:create">
          <a onClick={() => handleEdit(undefined, record.id)}>{t('common:add')}</a>
        </HasPermission>,
        <HasPermission key="edit" code="tenant:admin:auth:menu:update">
          <a onClick={() => handleEdit(record)}>{t('common:edit')}</a>
        </HasPermission>,
        <HasPermission key="delete" code="tenant:admin:auth:menu:delete">
          <Popconfirm
            title={t('system:menu.confirmDeleteMenu')}
            onConfirm={() => remove.mutate(record.id)}
          >
            <a style={{ color: '#ff4d4f' }}>{t('common:delete')}</a>
          </Popconfirm>
        </HasPermission>,
      ],
    },
  ]

  return (
    <PageContainer title={t('system:menu.title')}>
      <Tabs
        activeKey={activeClient}
        onChange={(key) => {
          setActiveClient(key as TenantClientType)
          // 切换端时刷新表格
          setTimeout(() => actionRef.current?.reload(), 0)
        }}
        items={[
          { key: 'admin', label: '后台端' },
          { key: 'miniapp', label: '小程序端' },
        ]}
      />

      <ProTable<TenantAuthMenuItem>
        actionRef={actionRef}
        columns={columns}
        request={async () => {
          const { data: menus } = await refetchMenuTree()
          return { data: menus ?? [], success: true }
        }}
        rowKey="id"
        search={false}
        pagination={false}
        toolBarRender={() => [
          <HasPermission key="add" code="tenant:admin:auth:menu:create">
            <Button type="primary" onClick={() => handleEdit()}>
              {t('system:menu.addMenu')}
            </Button>
          </HasPermission>,
        ]}
      />

      <FormContainer
        title={currentRecord?.id ? t('system:menu.editMenu') : t('system:menu.addMenu')}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialValues={
          currentRecord?.id
            ? currentRecord
            : { parentId: currentRecord?.parentId || 0, clientType: activeClient, type: 2, sort: 0, visible: 1, status: 1 }
        }
        onFinish={async (values) => {
          const submitValues = {
            ...values,
            clientType: activeClient,
            permission: buildPermissionValue(values.permission, permissionPrefix),
          }
          await submit.mutateAsync({ id: currentRecord?.id, values: submitValues })
          return true
        }}
      >
        {currentRecord?.parentId !== undefined && currentRecord.parentId !== 0 && (
          <ProFormTreeSelect
            name="parentId"
            label={t('system:menu.parentMenu')}
            fieldProps={{ treeData: treeSelectData, treeDefaultExpandAll: true }}
            rules={[{ required: true, message: t('system:menu.selectParentMenu') }]}
          />
        )}
        <ProFormSelect
          name="type"
          label={t('system:menu.menuType')}
          rules={[{ required: true, message: t('system:menu.selectMenuType') }]}
          options={[
            { label: t('system:menu.typeDirectory'), value: 1 },
            { label: t('system:menu.typeMenu'), value: 2 },
            { label: t('system:menu.typeButton'), value: 3 },
          ]}
        />
        <ProFormText
          name="name"
          label={t('system:menu.menuName')}
          rules={[{ required: true, message: t('system:menu.enterMenuName') }]}
        />
        <ProFormText name="icon" label={t('system:menu.icon')} />
        <ProFormText name="path" label={t('system:menu.routePath')} />
        <ProFormText name="component" label={t('system:menu.componentPath')} />
        <ProFormText
          name="permission"
          label={t('system:menu.permission')}
          fieldProps={permissionPrefix ? { addonBefore: permissionPrefix } : undefined}
        />
        <ProFormDigit name="sort" label={t('common:sort')} min={0} fieldProps={{ precision: 0 }} />
        <ProFormSelect
          name="visible"
          label={t('common:show')}
          options={[
            { label: t('common:show'), value: 1 },
            { label: t('common:hide'), value: 0 },
          ]}
        />
        <ProFormSelect
          name="status"
          label={t('common:status')}
          options={[
            { label: t('common:enabled'), value: 1 },
            { label: t('common:disabled'), value: 0 },
          ]}
        />
      </FormContainer>
    </PageContainer>
  )
}
