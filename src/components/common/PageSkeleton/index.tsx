import { Row, Col, Skeleton, Card } from 'antd'

interface PageSkeletonProps {
  type: 'table' | 'detail' | 'dashboard'
  /** dashboard 卡片数量，默认 4 */
  cards?: number
  /** table 骨架行数，默认 8 */
  rows?: number
}

const DashboardSkeleton: React.FC<{ cards: number }> = ({ cards }) => (
  <div>
    {/* 统计卡片区 */}
    <Row gutter={16} wrap>
      {Array(cards)
        .fill(null)
        .map((_, i) => (
          <Col key={i} xs={24} sm={12} lg={6} style={{ marginBottom: 16 }}>
            <Card>
              <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
            </Card>
          </Col>
        ))}
    </Row>
    {/* 内容面板区 */}
    <Row gutter={16} style={{ marginTop: 16 }}>
      <Col xs={24} lg={14}>
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </Col>
      <Col xs={24} lg={10} style={{ marginTop: 16 }}>
        <Card>
          <Skeleton active paragraph={{ rows: 5 }} />
        </Card>
      </Col>
    </Row>
  </div>
)

const TableSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <div>
    {/* 工具栏区 */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
      <Skeleton.Input active style={{ width: 200 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <Skeleton.Button active />
        <Skeleton.Button active />
      </div>
    </div>
    {/* 表格行区 */}
    {Array(rows)
      .fill(null)
      .map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 16,
            padding: '12px 0',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Skeleton.Input active style={{ width: 20, minWidth: 20 }} />
          <Skeleton.Input active style={{ flex: 2, minWidth: 0 }} />
          <Skeleton.Input active style={{ flex: 1, minWidth: 0 }} />
          <Skeleton.Input active style={{ flex: 1, minWidth: 0 }} />
          <Skeleton.Input active style={{ flex: 1, minWidth: 0 }} />
          <Skeleton.Button active style={{ width: 80 }} />
        </div>
      ))}
    {/* 分页区 */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 8 }}>
      <Skeleton.Button active />
      <Skeleton.Button active />
      <Skeleton.Button active />
    </div>
  </div>
)

const DetailSkeleton: React.FC = () => (
  <div style={{ padding: 24 }}>
    <Skeleton active avatar={{ size: 'large' }} paragraph={{ rows: 6 }} />
  </div>
)

/**
 * 页面级骨架屏组件
 *
 * 在数据加载完成前代替真实内容渲染，避免布局跳变（CLS），
 * 提升用户感知加载体验。
 *
 * @example
 * ```tsx
 * if (loading) return <PageSkeleton type="dashboard" />
 *
 * if (loading) return <PageSkeleton type="table" rows={10} />
 *
 * if (loading) return <PageSkeleton type="detail" />
 * ```
 */
export const PageSkeleton: React.FC<PageSkeletonProps> = ({ type, cards = 4, rows = 8 }) => {
  if (type === 'dashboard') return <DashboardSkeleton cards={cards} />
  if (type === 'table') return <TableSkeleton rows={rows} />
  return <DetailSkeleton />
}
