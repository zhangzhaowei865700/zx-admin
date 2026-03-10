import { useRef, useState, useCallback } from 'react'
import { Badge, Button, Descriptions, Divider, Drawer, Popconfirm, Space, Tabs, Tag } from 'antd'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { ProTable } from '@/components/common/ProTable'
import { PageContainer } from '@/components/common/PageContainer'
import { getMessageList } from '@/api/modules/platform/message'
import { useTranslation } from 'react-i18next'
import { useMessageStore } from '@/stores'
import type { Message, MessageType } from '@/types/platform/message'
import { useUnreadCountQuery, useMessageMutations } from './hooks/useMessage'

export const InboxPage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [activeType, setActiveType] = useState<string>('all')
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<Message>()
  const { t } = useTranslation(['message', 'common'])

  const { unreadCount } = useMessageStore()
  const clearSelection = useCallback(() => setSelectedRowKeys([]), [])

  // 进入收件箱时刷新未读数，并同步到 messageStore
  useUnreadCountQuery()

  const { markRead, markAllRead, remove } = useMessageMutations(actionRef, clearSelection)

  const typeColorMap: Record<MessageType, string> = {
    announcement: 'blue',
    notification: 'orange',
    message: 'green',
  }

  const typeLabelMap: Record<MessageType, string> = {
    announcement: t('message:announcement'),
    notification: t('message:notification'),
    message: t('message:privateMessage'),
  }

  const priorityMap = {
    normal: { color: 'default', text: t('message:priorityNormal') },
    important: { color: 'orange', text: t('message:priorityImportant') },
    urgent: { color: 'red', text: t('message:priorityUrgent') },
  }

  const handleView = useCallback(
    async (record: Message) => {
      setCurrentMessage(record)
      setDetailVisible(true)
      if (!record.isRead) {
        await markRead.mutateAsync([record.id])
      }
    },
    [markRead],
  )

  const columns: ProColumns<Message>[] = [
    {
      title: t('common:status'),
      dataIndex: 'isRead',
      width: 100,
      search: false,
      render: (_: unknown, record: Message) =>
        !record.isRead ? (
          <Badge status="processing" text={t('message:unread')} />
        ) : (
          <Badge status="default" text={t('message:read')} />
        ),
    },
    {
      title: t('message:type'),
      dataIndex: 'type',
      width: 120,
      valueType: 'select',
      valueEnum: {
        announcement: { text: t('message:announcement') },
        notification: { text: t('message:notification') },
        message: { text: t('message:privateMessage') },
      },
      render: (_: unknown, record: Message) => (
        <Tag color={typeColorMap[record.type]}>{typeLabelMap[record.type]}</Tag>
      ),
      hideInSearch: true,
    },
    {
      title: t('message:messageTitle'),
      dataIndex: 'title',
      width: 250,
      ellipsis: true,
      render: (_: unknown, record: Message) => (
        <a
          style={{ fontWeight: record.isRead ? 'normal' : 'bold' }}
          onClick={() => handleView(record)}
        >
          {record.title}
        </a>
      ),
    },
    {
      title: t('message:priority'),
      dataIndex: 'priority',
      width: 100,
      search: false,
      render: (_: unknown, record: Message) => (
        <Tag color={priorityMap[record.priority].color}>{priorityMap[record.priority].text}</Tag>
      ),
    },
    {
      title: t('message:sender'),
      dataIndex: 'senderName',
      width: 120,
      search: false,
    },
    {
      title: t('message:time'),
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 170,
      search: false,
    },
    {
      title: t('common:operation'),
      valueType: 'option',
      width: 150,
      render: (_: unknown, record: Message) => (
        <Space size="middle">
          {!record.isRead && (
            <a onClick={() => markRead.mutate([record.id])}>{t('message:markRead')}</a>
          )}
          <Popconfirm
            title={t('common:confirmDelete')}
            onConfirm={() => remove.mutate([record.id])}
          >
            <a style={{ color: '#ff4d4f' }}>{t('common:delete')}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const tabItems = [
    { key: 'all', label: t('message:all') },
    {
      key: 'announcement',
      label: (
        <span>
          {t('message:announcement')}
          {unreadCount.announcement > 0 && (
            <Badge count={unreadCount.announcement} size="small" offset={[6, -2]} />
          )}
        </span>
      ),
    },
    {
      key: 'notification',
      label: (
        <span>
          {t('message:notification')}
          {unreadCount.notification > 0 && (
            <Badge count={unreadCount.notification} size="small" offset={[6, -2]} />
          )}
        </span>
      ),
    },
    {
      key: 'message',
      label: (
        <span>
          {t('message:privateMessage')}
          {unreadCount.message > 0 && (
            <Badge count={unreadCount.message} size="small" offset={[6, -2]} />
          )}
        </span>
      ),
    },
  ]

  return (
    <PageContainer title={t('message:title')}>
      <Tabs
        activeKey={activeType}
        items={tabItems}
        onChange={(key) => {
          setActiveType(key)
          setSelectedRowKeys([])
          actionRef.current?.reload()
        }}
        style={{ marginBottom: -8 }}
      />
      <ProTable<Message>
        actionRef={actionRef}
        columns={columns}
        request={async (params) => {
          const result = await getMessageList({
            ...params,
            pageNum: params.current,
            pageSize: params.pageSize,
            type: activeType === 'all' ? undefined : (activeType as MessageType),
            keyword: params.title,
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
            <a onClick={() => { markRead.mutate(selectedRowKeys); onCleanSelected() }}>
              {t('message:batchRead')}
            </a>
            <Popconfirm
              title={t('message:confirmDeleteMessages', { count: selectedRowKeys.length })}
              onConfirm={() => { remove.mutate(selectedRowKeys); onCleanSelected() }}
            >
              <a style={{ color: '#ff4d4f' }}>{t('common:batchDelete')}</a>
            </Popconfirm>
          </Space>
        )}
        toolBarRender={() => [
          <Button key="readAll" onClick={() => markAllRead.mutate()}>
            {t('message:allRead')}
          </Button>,
        ]}
      />

      <Drawer
        title={currentMessage?.title}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        width={600}
      >
        {currentMessage && (
          <>
            <Descriptions column={2}>
              <Descriptions.Item label={t('message:type')}>
                <Tag color={typeColorMap[currentMessage.type]}>
                  {typeLabelMap[currentMessage.type]}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('message:priority')}>
                <Tag color={priorityMap[currentMessage.priority].color}>
                  {priorityMap[currentMessage.priority].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('message:sender')}>{currentMessage.senderName}</Descriptions.Item>
              <Descriptions.Item label={t('message:time')}>{currentMessage.createdAt}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <div style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{currentMessage.content}</div>
          </>
        )}
      </Drawer>
    </PageContainer>
  )
}
