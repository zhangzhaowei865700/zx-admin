import { useState, useRef, useEffect, useCallback, Children, isValidElement, cloneElement } from 'react'
import { Popover, theme as antTheme } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

interface OverflowActionsProps {
  /** 子元素间距 */
  gap?: number
  children: React.ReactNode
}

// ... 按钮自身占用的宽度
const MORE_BTN_WIDTH = 32

/**
 * 自适应溢出容器
 * 通过实际测量每个子元素宽度，精确计算放得下几个
 * 放不下的自动收进 ... 下拉菜单，全部放得下时不显示 ...
 */
export const OverflowActions: React.FC<OverflowActionsProps> = ({
  gap = 4,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState<number | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { token } = antTheme.useToken()
  const location = useLocation()

  // 路由变化时关闭省略号弹窗
  useEffect(() => {
    setPopoverOpen(false)
  }, [location])

  // 监听自定义关闭事件（处理嵌套 portal 中的导航场景）
  useEffect(() => {
    const handler = () => setPopoverOpen(false)
    window.addEventListener('overflow-popover-close', handler)
    return () => window.removeEventListener('overflow-popover-close', handler)
  }, [])

  const calcVisible = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const childEls = Array.from(el.children).filter(
      (c) => !(c as HTMLElement).dataset.overflowBtn,
    )
    const childCount = childEls.length
    if (childCount === 0) { setVisibleCount(0); return }

    const containerWidth = el.clientWidth

    // 先算全部放下需要多宽
    let totalNeeded = 0
    const widths: number[] = []
    for (const child of childEls) {
      const w = (child as HTMLElement).offsetWidth
      widths.push(w)
      totalNeeded += w
    }
    totalNeeded += (childCount - 1) * gap

    // 全部放得下
    if (totalNeeded <= containerWidth) {
      setVisibleCount(childCount)
      return
    }

    // 否则从左到右累加，给 ... 按钮留位置
    const available = containerWidth - MORE_BTN_WIDTH - gap
    let used = 0
    let count = 0
    for (let i = 0; i < widths.length; i++) {
      const need = used + widths[i] + (i > 0 ? gap : 0)
      if (need > available) break
      used = need
      count++
    }
    setVisibleCount(Math.max(count, 0))
  }, [children, gap])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    // 首次计算前先让所有子元素渲染出来以获取真实宽度
    requestAnimationFrame(calcVisible)
    const ro = new ResizeObserver(calcVisible)
    ro.observe(el)
    return () => ro.disconnect()
  }, [calcVisible])

  const validChildren = Children.toArray(children).filter(isValidElement)
  // 首次渲染时 visibleCount 为 null，先全部渲染但隐藏溢出（用于测量）
  const isMeasuring = visibleCount === null
  const count = isMeasuring ? validChildren.length : visibleCount
  const visibleItems = validChildren.slice(0, count)
  const overflowItems = isMeasuring ? [] : validChildren.slice(count)

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap,
        flex: '1 1 0%',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {visibleItems}
      {overflowItems.length > 0 && (
        <Popover
          placement="bottomRight"
          arrow={false}
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          content={
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0' }}>
              {overflowItems.map((child, i) =>
                isValidElement(child) ? cloneElement(child, { key: i }) : child,
              )}
            </div>
          }
          trigger="click"
        >
          <span
              role="button"
              tabIndex={0}
              data-overflow-btn
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 16,
                color: token.colorTextSecondary,
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = token.colorFillTertiary
                e.currentTarget.style.color = token.colorText
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = token.colorTextSecondary
              }}
            >
              <EllipsisOutlined />
            </span>
        </Popover>
      )}
    </div>
  )
}
