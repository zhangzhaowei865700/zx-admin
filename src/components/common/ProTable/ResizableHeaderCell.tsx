import { useCallback, useRef } from 'react'

interface ResizableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** 当前列宽 */
  resizableWidth?: number
  /** 拖拽结束回调 */
  onResizeEnd?: (width: number) => void
  /** 是否启用拖拽 */
  resizable?: boolean
}

/**
 * 可拖拽列头单元格
 * 拖拽过程中直接操作 DOM（col 元素 + th 宽度），实现实时视觉反馈
 * 拖拽结束后通过回调更新 React 状态
 */
export const ResizableHeaderCell: React.FC<ResizableHeaderCellProps> = ({
  resizableWidth,
  onResizeEnd,
  resizable,
  children,
  style,
  ...restProps
}) => {
  const thRef = useRef<HTMLTableCellElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const startX = e.clientX
      const startWidth = resizableWidth || thRef.current?.offsetWidth || 0

      const th = thRef.current
      if (!th) return

      // Ant Design 表格的 header 和 body 可能是两个独立的 table
      // 需要找到外层容器，同时更新所有 table 的对应 col
      const thIndex = Array.from(th.parentElement!.children).indexOf(th)
      const container = th.closest('.ant-table-container') || th.closest('.ant-table-wrapper')
      const colElements: HTMLElement[] = []
      if (container) {
        container.querySelectorAll('table').forEach((table) => {
          const col = table.querySelector('colgroup')?.children[thIndex] as HTMLElement | null
          if (col) colElements.push(col)
        })
      }

      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      const onMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startX
        const newWidth = Math.max(50, startWidth + diff)
        const px = `${newWidth}px`
        for (const col of colElements) {
          col.style.width = px
          col.style.minWidth = px
        }
        th.style.width = px
        th.style.minWidth = px
      }

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''

        const diff = e.clientX - startX
        const finalWidth = Math.max(50, startWidth + diff)
        onResizeEnd?.(finalWidth)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    [resizableWidth, onResizeEnd]
  )

  if (!resizable || resizableWidth == null) {
    return (
      <th ref={thRef} style={style} {...restProps}>
        {children}
      </th>
    )
  }

  return (
    <th ref={thRef} style={{ ...style, position: 'relative' }} {...restProps}>
      {children}
      <span
        style={{
          position: 'absolute',
          right: -4,
          top: 0,
          bottom: 0,
          width: 8,
          cursor: 'col-resize',
          zIndex: 1,
        }}
        onMouseDown={handleMouseDown}
      />
    </th>
  )
}
