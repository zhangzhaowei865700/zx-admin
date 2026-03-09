import { Row, Col, Skeleton, Card } from 'antd'

interface PageSkeletonProps {
  type: 'table' | 'detail' | 'dashboard'
  /** dashboard 卡片数量，默认 4 */
  cards?: number
  /** table 骨架行数，默认 6 */
  rows?: number
}

const DashboardSkeleton: React.FC<{ cards: number }> = ({ cards }) => (
  <div style={{ padding: 24 }}>
    <Row gutter={[16, 16]}>
      {Array(cards)
        .fill(null)
        .map((_, i) => (
          <Col key={i} xs={24} sm={12} lg={6}>
            <Card>
              <Skeleton active title={{ width: '40%' }} paragraph={{ rows: 1, width: ['60%'] }} />
            </Card>
          </Col>
        ))}
    </Row>
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col xs={24} lg={14}>
        <Card>
          <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 5 }} />
        </Card>
      </Col>
      <Col xs={24} lg={10}>
        <Card>
          <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 4 }} />
        </Card>
      </Col>
    </Row>
  </div>
)

const TableSkeleton: React.FC<{ rows: number }> = ({ rows }) => (
  <div style={{ padding: 24 }}>
    {/* 搜索栏 */}
    <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
      {[120, 150, 120].map((w, i) => (
        <div key={i} style={{ width: w, height: 32, borderRadius: 6, background: 'rgba(0,0,0,0.06)' }} />
      ))}
      <div style={{ width: 64, height: 32, borderRadius: 6, background: 'rgba(0,0,0,0.06)' }} />
    </div>
    {/* 工具栏 */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ width: 80, height: 32, borderRadius: 6, background: 'rgba(0,0,0,0.06)' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(0,0,0,0.06)' }} />
        <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(0,0,0,0.06)' }} />
      </div>
    </div>
    {/* 表头 */}
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      {['5%', '25%', '20%', '15%', '15%', '10%'].map((w, i) => (
        <div key={i} style={{ width: w, height: 14, borderRadius: 4, background: 'rgba(0,0,0,0.08)' }} />
      ))}
    </div>
    {/* 表格行 */}
    {Array(rows)
      .fill(null)
      .map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 12,
            padding: '14px 0',
            borderBottom: '1px solid rgba(0,0,0,0.04)',
          }}
        >
          {['5%', '25%', '20%', '15%', '15%', '10%'].map((w, j) => (
            <div
              key={j}
              style={{
                width: w,
                height: 12,
                borderRadius: 4,
                background: 'rgba(0,0,0,0.04)',
                animation: 'skeleton-pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      ))}
    {/* 分页 */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 16, gap: 6 }}>
      {[28, 28, 28, 28, 28].map((w, i) => (
        <div key={i} style={{ width: w, height: 28, borderRadius: 4, background: 'rgba(0,0,0,0.04)' }} />
      ))}
    </div>
    <style>{`
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    `}</style>
  </div>
)

const DetailSkeleton: React.FC = () => (
  <div style={{ padding: 24, maxWidth: 600 }}>
    {/* 表单分组标题 */}
    <div style={{ width: 100, height: 14, borderRadius: 4, background: 'rgba(0,0,0,0.08)', marginBottom: 24 }} />
    {/* 表单项 */}
    {Array(3)
      .fill(null)
      .map((_, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          <div style={{ width: 80, height: 12, borderRadius: 4, background: 'rgba(0,0,0,0.06)', marginBottom: 10 }} />
          <div style={{ height: 32, borderRadius: 6, background: 'rgba(0,0,0,0.04)' }} />
        </div>
      ))}
    {/* 第二组 */}
    <div style={{ width: 100, height: 14, borderRadius: 4, background: 'rgba(0,0,0,0.08)', margin: '32px 0 24px' }} />
    {Array(3)
      .fill(null)
      .map((_, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          <div style={{ width: 80, height: 12, borderRadius: 4, background: 'rgba(0,0,0,0.06)', marginBottom: 10 }} />
          <div style={{ height: 32, borderRadius: 6, background: 'rgba(0,0,0,0.04)' }} />
        </div>
      ))}
    {/* 提交按钮 */}
    <div style={{ width: 100, height: 32, borderRadius: 6, background: 'rgba(0,0,0,0.06)', marginTop: 8 }} />
  </div>
)

/**
 * 页面级骨架屏组件
 *
 * @example
 * ```tsx
 * if (loading) return <PageSkeleton type="dashboard" />
 * if (loading) return <PageSkeleton type="table" rows={10} />
 * if (loading) return <PageSkeleton type="detail" />
 * ```
 */
export const PageSkeleton: React.FC<PageSkeletonProps> = ({ type, cards = 4, rows = 6 }) => {
  if (type === 'dashboard') return <DashboardSkeleton cards={cards} />
  if (type === 'table') return <TableSkeleton rows={rows} />
  return <DetailSkeleton />
}
