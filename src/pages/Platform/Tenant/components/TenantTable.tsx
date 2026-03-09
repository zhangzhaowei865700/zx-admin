import { Tag } from 'antd'
import type { TableProps } from 'antd'
import type { Tenant } from '@/types'
import { formatDate } from '@/utils/format'

export const tenantStatusMap: Record<number, { color: string; text: string }> = {
  0: { color: 'default', text: '禁用' },
  1: { color: 'success', text: '启用' },
}

export const tenantColumns: TableProps<Tenant>['columns'] = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '编码', dataIndex: 'code', key: 'code' },
  { title: '联系人', dataIndex: 'contact', key: 'contact' },
  { title: '电话', dataIndex: 'phone', key: 'phone' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: number) => {
      const item = tenantStatusMap[status] || tenantStatusMap[0]
      return <Tag color={item.color}>{item.text}</Tag>
    },
  },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (val: string) => formatDate(val) },
]
