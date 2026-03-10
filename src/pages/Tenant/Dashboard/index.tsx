import { Statistic, Progress, Tag } from 'antd'
import { ProCard } from '@ant-design/pro-components'
import { PageSkeleton } from '@/components/common/PageSkeleton'
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/common/PageContainer'
import { ProTable } from '@/components/common/ProTable'
import type { TenantOrder } from '@/types/tenant'
import { useDashboardStatsQuery, useRecentOrdersQuery } from './hooks/useDashboard'

export const TenantDashboardPage: React.FC = () => {
  const { t } = useTranslation(['tenant', 'order', 'common'])

  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery()
  const { data: recentOrders = [], isLoading: ordersLoading } = useRecentOrdersQuery()

  const loading = statsLoading || ordersLoading

  const defaultStats = { todayOrders: 0, todayRevenue: 0, totalProducts: 0, totalCustomers: 0 }
  const { todayOrders, todayRevenue, totalProducts, totalCustomers } = stats ?? defaultStats

  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: t('order:statusPending'), color: 'orange' },
    1: { text: t('order:statusPaid'), color: 'blue' },
    2: { text: t('order:statusShipped'), color: 'cyan' },
    3: { text: t('order:statusCompleted'), color: 'green' },
  }

  const orderColumns = [
    { title: t('order:orderNo'), dataIndex: 'orderNo', key: 'orderNo', width: 180 },
    { title: t('order:customer'), dataIndex: 'customerName', key: 'customerName', width: 120 },
    {
      title: t('order:amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (_: unknown, record: TenantOrder) => `¥${record.amount.toFixed(2)}`,
    },
    {
      title: t('common:status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_: unknown, record: TenantOrder) => (
        <Tag color={statusMap[record.status].color}>{statusMap[record.status].text}</Tag>
      ),
    },
  ]

  return (
    <PageContainer>
      {loading ? (
        <PageSkeleton type="dashboard" />
      ) : (
        <>
          <ProCard gutter={[16, 16]} ghost wrap>
            <ProCard colSpan={{ xs: 24, sm: 12, lg: 6 }}>
              <Statistic
                title={t('tenant:dashboard.todayOrders')}
                value={todayOrders}
                prefix={<ShoppingCartOutlined />}
              />
            </ProCard>
            <ProCard colSpan={{ xs: 24, sm: 12, lg: 6 }}>
              <Statistic
                title={t('tenant:dashboard.todayRevenue')}
                value={todayRevenue}
                precision={2}
                prefix={<DollarOutlined />}
                suffix={t('tenant:dashboard.yuan')}
              />
            </ProCard>
            <ProCard colSpan={{ xs: 24, sm: 12, lg: 6 }}>
              <Statistic
                title={t('tenant:dashboard.totalProducts')}
                value={totalProducts}
                prefix={<ShopOutlined />}
              />
            </ProCard>
            <ProCard colSpan={{ xs: 24, sm: 12, lg: 6 }}>
              <Statistic
                title={t('tenant:dashboard.totalCustomers')}
                value={totalCustomers}
                prefix={<UserOutlined />}
              />
            </ProCard>
          </ProCard>

          <ProCard gutter={[16, 16]} ghost wrap style={{ marginTop: 16 }}>
            <ProCard
              colSpan={{ xs: 24, lg: 14 }}
              title={t('tenant:dashboard.recentOrders')}
              headerBordered
            >
              <ProTable
                columns={orderColumns}
                dataSource={recentOrders}
                rowKey="id"
                size="small"
                pagination={false}
                search={false}
                toolBarRender={false}
              />
            </ProCard>
            <ProCard
              colSpan={{ xs: 24, lg: 10 }}
              title={t('tenant:dashboard.productOverview')}
              headerBordered
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <span>{t('tenant:dashboard.onSale')}</span>
                  <Progress percent={78} status="active" />
                </div>
                <div>
                  <span>{t('tenant:dashboard.stockSufficient')}</span>
                  <Progress percent={62} strokeColor="#52c41a" />
                </div>
                <div>
                  <span>{t('tenant:dashboard.stockWarning')}</span>
                  <Progress percent={15} strokeColor="#faad14" />
                </div>
                <div>
                  <span>{t('tenant:dashboard.soldOut')}</span>
                  <Progress percent={5} strokeColor="#ff4d4f" />
                </div>
              </div>
            </ProCard>
          </ProCard>
        </>
      )}
    </PageContainer>
  )
}
