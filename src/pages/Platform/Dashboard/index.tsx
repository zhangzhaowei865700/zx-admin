import { Statistic, Progress, Tag, Typography } from 'antd'
import { ProCard } from '@ant-design/pro-components'
import {
  ShopOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  MenuOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/common/PageContainer'
import { ProTable } from '@/components/common/ProTable'

const { Text } = Typography

const recentTenants = [
  { id: 1, name: '星巴克旗舰店', contact: '张经理', phone: '138****1234', status: 1, createdAt: '2024-03-08' },
  { id: 2, name: '肯德基中心店', contact: '李经理', phone: '139****5678', status: 1, createdAt: '2024-03-07' },
  { id: 3, name: '麦当劳万达店', contact: '王经理', phone: '137****9012', status: 0, createdAt: '2024-03-06' },
  { id: 4, name: '瑞幸咖啡科技园店', contact: '赵经理', phone: '136****3456', status: 1, createdAt: '2024-03-05' },
  { id: 5, name: '喜茶购物中心店', contact: '钱经理', phone: '135****7890', status: 1, createdAt: '2024-03-04' },
]

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation(['tenant', 'common'])

  const tenantColumns = [
    { title: t('tenant:platformDashboard.storeName'), dataIndex: 'name', key: 'name', width: 150 },
    { title: t('tenant:platformDashboard.contact'), dataIndex: 'contact', key: 'contact', width: 100 },
    { title: t('tenant:platformDashboard.phone'), dataIndex: 'phone', key: 'phone', width: 130 },
    {
      title: t('common:status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_: unknown, record: (typeof recentTenants)[number]) => (
        <Tag icon={record.status === 1 ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={record.status === 1 ? 'success' : 'error'}>
          {record.status === 1 ? t('common:enabled') : t('common:disabled')}
        </Tag>
      ),
    },
    { title: t('common:createTime'), dataIndex: 'createdAt', key: 'createdAt', width: 120 },
  ]

  return (
    <PageContainer>
      <ProCard gutter={[16, 16]} ghost wrap>
        <ProCard colSpan={{ xs: 24, sm: 12, lg: 6 }}>
          <Statistic title={t('tenant:platformDashboard.totalTenants')} value={128} prefix={<ShopOutlined />} />
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 12, lg: 6 }}>
          <Statistic title={t('tenant:platformDashboard.systemUsers')} value={56} prefix={<UserOutlined />} />
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 12, lg: 6 }}>
          <Statistic title={t('tenant:platformDashboard.roleCount')} value={12} prefix={<SafetyCertificateOutlined />} />
        </ProCard>
        <ProCard colSpan={{ xs: 24, sm: 12, lg: 6 }}>
          <Statistic title={t('tenant:platformDashboard.menuCount')} value={34} prefix={<MenuOutlined />} />
        </ProCard>
      </ProCard>

      <ProCard gutter={[16, 16]} ghost wrap style={{ marginTop: 16 }}>
        <ProCard colSpan={{ xs: 24, lg: 14 }} title={t('tenant:platformDashboard.recentTenants')} headerBordered>
          <ProTable
            columns={tenantColumns}
            dataSource={recentTenants}
            rowKey="id"
            size="small"
            pagination={false}
            search={false}
            toolBarRender={false}
          />
        </ProCard>
        <ProCard colSpan={{ xs: 24, lg: 10 }} title={t('tenant:platformDashboard.systemOverview')} headerBordered>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text>{t('tenant:platformDashboard.tenantEnableRate')}</Text>
                <Text type="secondary">96/128</Text>
              </div>
              <Progress percent={75} status="active" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text>{t('tenant:platformDashboard.userActiveRate')}</Text>
                <Text type="secondary">42/56</Text>
              </div>
              <Progress percent={75} strokeColor="#52c41a" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text>{t('tenant:platformDashboard.roleAssignRate')}</Text>
                <Text type="secondary">10/12</Text>
              </div>
              <Progress percent={83} strokeColor="#1677ff" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text>{t('tenant:platformDashboard.systemStorage')}</Text>
                <Text type="secondary">3.2 / 10 GB</Text>
              </div>
              <Progress percent={32} strokeColor="#faad14" />
            </div>
          </div>
        </ProCard>
      </ProCard>
    </PageContainer>
  )
}
