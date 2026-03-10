import { useRef, useCallback, useState, useMemo } from 'react'
import { ProTable as AntProTable } from '@ant-design/pro-components'
import type { ProTableProps, ProColumns } from '@ant-design/pro-components'
import { Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/stores'
import { ExportModal } from './ExportModal'
import { ResizableHeaderCell } from './ResizableHeaderCell'
import { PAGINATION } from '@/constants'

interface ExportableProTableProps<T extends Record<string, any>, U extends Record<string, any> = Record<string, any>>
  extends ProTableProps<T, U> {
  /** 是否显示导出按钮 */
  exportable?: boolean
  /** 导出文件名（不含扩展名） */
  exportFileName?: string
  /** 获取全量数据的回调（用于"全量数据"导出） */
  onExportAllData?: () => Promise<T[]>
}

function ProTable<T extends Record<string, any>, U extends Record<string, any> = Record<string, any>>(
  props: ExportableProTableProps<T, U>
) {
  const { exportable, exportFileName, onExportAllData, postData, columns, rowSelection, optionsRender, pagination, scroll, ...restProps } = props
  const { t } = useTranslation()
  const { tableSize, tableBordered, tableResizable } = useAppStore()
  const dataRef = useRef<T[]>([])
  const [exportOpen, setExportOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})

  const handlePostData = useCallback(
    (data: T[]) => {
      dataRef.current = data
      return postData ? postData(data) : data
    },
    [postData]
  )

  // 通过 optionsRender 在工具栏图标区追加导出图标
  const mergedOptionsRender: typeof optionsRender = exportable
    ? (props, defaultDoms) => {
        const exportIcon = (
          <Tooltip key="export" title={t('common:export')}>
            <DownloadOutlined
              style={{ fontSize: 17, cursor: 'pointer' }}
              onClick={() => setExportOpen(true)}
            />
          </Tooltip>
        )
        const doms = optionsRender ? optionsRender(props, defaultDoms) : defaultDoms
        return [exportIcon, ...doms]
      }
    : optionsRender

  // 合并 rowSelection 以捕获选中行，受控管理 selectedRowKeys
  const mergedRowSelection = exportable
    ? {
        ...(typeof rowSelection === 'object' ? rowSelection : {}),
        selectedRowKeys,
        onChange: (keys: React.Key[], rows: T[], info: any) => {
          setSelectedRowKeys(keys)
          setSelectedRows(rows)
          if (typeof rowSelection === 'object') {
            rowSelection.onChange?.(keys as any, rows, info)
          }
        },
      }
    : rowSelection

  // 默认分页配置：支持切换每页条数
  const defaultPagination = pagination === false
    ? false
    : {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: PAGINATION.PAGE_SIZE_OPTIONS.map(String),
        ...(typeof pagination === 'object' ? pagination : {}),
      }

  // 可拖拽列宽：为所有列注入 onHeaderCell，没有 width 的列使用默认宽度 150
  const resizableColumns = useMemo(() => {
    if (!tableResizable || !columns) return columns
    return columns.map((col) => {
      const key = String((col as any).dataIndex || (col as any).key || '')
      if (!key) return col

      // 使用已保存的宽度，或列定义的宽度，或默认宽度 150
      const width = columnWidths[key] ?? (col as any).width ?? 150

      return {
        ...col,
        width,
        onHeaderCell: () => ({
          resizableWidth: width,
          resizable: true,
          onResizeEnd: (newWidth: number) => {
            setColumnWidths((prev) => ({ ...prev, [key]: newWidth }))
          },
        }),
      } as ProColumns<T>
    })
  }, [tableResizable, columns, columnWidths])

  const resizableComponents = useMemo(
    () => (tableResizable ? { header: { cell: ResizableHeaderCell } } : undefined),
    [tableResizable]
  )

  // 默认启用横向滚动，防止移动端表格挤压变形
  const defaultScroll = scroll ?? { x: 'max-content' }

  return (
    <>
      <AntProTable<T, U>
        size={tableSize}
        bordered={tableBordered}
        columns={resizableColumns}
        components={resizableComponents}
        postData={handlePostData}
        rowSelection={mergedRowSelection}
        optionsRender={mergedOptionsRender}
        pagination={defaultPagination}
        scroll={defaultScroll}
        {...restProps}
      />
      {exportable && columns && (
        <ExportModal
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          columns={columns}
          currentData={dataRef.current}
          selectedData={selectedRows}
          onFetchAllData={onExportAllData}
          defaultFileName={exportFileName}
        />
      )}
    </>
  )
}

export { ProTable }
