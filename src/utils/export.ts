import * as XLSX from 'xlsx-js-style'
import type { ProColumns } from '@ant-design/pro-components'
import i18n from '@/locales'

export type ExportFileType = 'csv' | 'html' | 'xml' | 'txt' | 'xlsx'

/**
 * 表尾聚合配置类型
 * - 'sum': 求和
 * - 'avg': 平均值
 * - 'max': 最大值
 * - 'min': 最小值
 * - 'count': 计数
 * - string: 固定文本
 * - function: 自定义计算函数
 * - false: 禁用汇总
 */
export type ExportFooterConfig =
  | 'sum'
  | 'avg'
  | 'max'
  | 'min'
  | 'count'
  | string
  | ((data: any[], column: ProColumns<any>) => string | number)
  | false

/**
 * 扩展 ProColumns，支持自定义表尾配置
 */
export interface ExtendedProColumns<T> extends ProColumns<T> {
  /**
   * 导出表尾配置
   * - 未设置时，数值列（digit/money/percent）自动求和
   * - 设置为 false 可禁用自动汇总
   */
  exportFooter?: ExportFooterConfig
}

export const getFileTypeOptions = (): { value: ExportFileType; label: string }[] => [
  { value: 'xlsx', label: i18n.t('common:fileTypeXlsx') },
  { value: 'csv', label: i18n.t('common:fileTypeCsv') },
  { value: 'html', label: i18n.t('common:fileTypeHtml') },
  { value: 'xml', label: i18n.t('common:fileTypeXml') },
  { value: 'txt', label: i18n.t('common:fileTypeTxt') },
]

export type DataScope = 'current' | 'selected' | 'all'

export const getDataScopeOptions = (): { value: DataScope; label: string }[] => [
  { value: 'current', label: i18n.t('common:dataScopeCurrent') },
  { value: 'selected', label: i18n.t('common:dataScopeSelected') },
  { value: 'all', label: i18n.t('common:dataScopeAll') },
]

export interface ExportOptions {
  filename: string
  fileType: ExportFileType
  selectedFields: string[]
  includeHeader: boolean // 表头（合并单元格的大标题）
  headerTitle?: string // 表头标题内容
  includeColumnHeader: boolean // 列标题（字段名）
  includeFooter: boolean
  rawData: boolean
}

/**
 * 从嵌套对象中按 dataIndex 路径取值
 */
function getNestedValue(obj: Record<string, any>, path: string | string[]): any {
  const keys = Array.isArray(path) ? path : String(path).split('.')
  return keys.reduce((acc, key) => acc?.[key], obj)
}

/**
 * 获取 dataIndex 的字符串 key
 */
export function getDataIndexKey(dataIndex: string | string[] | number | undefined): string {
  if (!dataIndex) return ''
  if (Array.isArray(dataIndex)) return dataIndex.join('.')
  return String(dataIndex)
}

/**
 * 获取可导出的列（排除操作列和无 dataIndex 的列）
 */
export function getExportableColumns<T extends Record<string, any>>(
  columns: ProColumns<T>[]
): ProColumns<T>[] {
  return columns.filter((col) => col.valueType !== 'option' && col.dataIndex)
}

/**
 * 从 ProColumns 和数据中提取表头和行数据
 */
function prepareExportData<T extends Record<string, any>>(
  columns: ProColumns<T>[],
  data: T[],
  options: ExportOptions
): { headers: string[]; rows: any[][] } {
  // 按选中字段过滤，只选有 dataIndex 的列
  const selectedColumns = columns.filter((col) => {
    if (!col.dataIndex) return false
    return options.selectedFields.includes(getDataIndexKey(col.dataIndex as string | string[]))
  })

  const headers = selectedColumns.map((col) => (col.title as string) || '')

  const rows = data.map((record) =>
    selectedColumns.map((col) => {
      const raw = getNestedValue(record, col.dataIndex as string | string[])

      if (!options.rawData && col.valueEnum && raw !== undefined && raw !== null) {
        const enumItem = (col.valueEnum as Record<string, any>)[String(raw)]
        if (enumItem) {
          return typeof enumItem === 'object' ? enumItem.text : enumItem
        }
      }

      if (raw === undefined || raw === null) return ''
      return raw
    })
  )

  return { headers, rows }
}

/**
 * 判断列是否为数值类型
 */
function isNumericColumn<T extends Record<string, any>>(col: ProColumns<T>): boolean {
  return col.valueType === 'digit' || col.valueType === 'money' || col.valueType === 'percent'
}

/**
 * 执行聚合计算
 */
function aggregateValues(data: any[], col: ProColumns<any>, aggType: string): number {
  const values = data.map((record) => {
    const value = getNestedValue(record, col.dataIndex as string | string[])
    return Number(value)
  }).filter((v) => !isNaN(v))

  if (values.length === 0) return 0

  switch (aggType) {
    case 'sum':
      return values.reduce((a, b) => a + b, 0)
    case 'avg':
      return values.reduce((a, b) => a + b, 0) / values.length
    case 'max':
      return Math.max(...values)
    case 'min':
      return Math.min(...values)
    case 'count':
      return data.length
    default:
      return 0
  }
}

/**
 * 格式化聚合结果
 */
function formatAggregateResult(value: number, col: ProColumns<any>, aggType: string): string | number {
  // 根据列类型格式化
  if (col.valueType === 'money') {
    return value.toFixed(2)
  } else if (col.valueType === 'percent') {
    return value.toFixed(2) + '%'
  } else if (aggType === 'avg') {
    return value.toFixed(2)
  } else {
    return value
  }
}

/**
 * 计算表尾汇总行
 */
function calculateFooterRow<T extends Record<string, any>>(
  columns: ExtendedProColumns<T>[],
  data: T[]
): any[] {
  if (data.length === 0) return []

  return columns.map((col, index) => {
    // 第一列显示"合计"（如果没有自定义配置）
    if (index === 0 && col.exportFooter === undefined) {
      return i18n.t('common:total')
    }

    const config = col.exportFooter

    // 明确禁用
    if (config === false) {
      return ''
    }

    // 自定义函数
    if (typeof config === 'function') {
      return config(data, col)
    }

    // 确定聚合类型
    let aggType: string | null = null
    if (config && typeof config === 'string' && ['sum', 'avg', 'max', 'min', 'count'].includes(config)) {
      aggType = config
    } else if (config === undefined && isNumericColumn(col)) {
      // 未配置时，数值列默认求和
      aggType = 'sum'
    } else if (typeof config === 'string') {
      // 固定文本
      return config
    }

    // 执行聚合计算
    if (aggType) {
      const result = aggregateValues(data, col, aggType)
      return formatAggregateResult(result, col, aggType)
    }

    return ''
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 统一导出入口
 */
export function exportData<T extends Record<string, any>>(
  columns: ExtendedProColumns<T>[],
  data: T[],
  options: ExportOptions
) {
  const { headers, rows } = prepareExportData(columns, data, options)
  const { filename, fileType, includeHeader, headerTitle, includeColumnHeader, includeFooter } = options

  // 计算表尾行
  const selectedColumns = columns.filter((col) => {
    if (!col.dataIndex) return false
    return options.selectedFields.includes(getDataIndexKey(col.dataIndex as string | string[]))
  })
  const footerRow = includeFooter ? calculateFooterRow(selectedColumns, data) : null

  switch (fileType) {
    case 'xlsx': {
      let sheetData: any[][] = []

      // 添加表头（合并单元格的大标题）
      if (includeHeader && headerTitle) {
        sheetData.push([headerTitle])
      }

      // 添加列标题
      if (includeColumnHeader) {
        sheetData.push(headers)
      }

      // 添加数据行
      sheetData = [...sheetData, ...rows]

      // 添加表尾
      if (footerRow) {
        sheetData = [...sheetData, footerRow]
      }

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(sheetData)

      // 合并表头单元格并设置样式
      if (includeHeader && headerTitle) {
        ws['!merges'] = [
          {
            s: { r: 0, c: 0 }, // 起始行列
            e: { r: 0, c: headers.length - 1 }, // 结束行列
          },
        ]
        // 设置表头样式（居中、加粗、字号14）
        const headerCell = ws['A1']
        if (headerCell) {
          headerCell.s = {
            alignment: { horizontal: 'center', vertical: 'center' },
            font: { bold: true, sz: 14 },
          }
        }
      }

      // 设置列宽
      if (includeColumnHeader) {
        ws['!cols'] = headers.map((header, i) => {
          const maxLen = Math.max(
            header.length * 2,
            ...rows.map((row) => String(row[i] ?? '').length)
          )
          return { wch: Math.min(Math.max(maxLen, 8), 50) }
        })
      }

      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      XLSX.writeFile(wb, `${filename}.xlsx`)
      break
    }

    case 'csv': {
      const escape = (val: any) => {
        const str = String(val ?? '')
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }
      let lines: string[] = []

      // 添加表头（CSV 中表头会占用一整行，所有列合并显示）
      if (includeHeader && headerTitle) {
        lines.push(escape(headerTitle))
      }

      // 添加列标题
      if (includeColumnHeader) {
        lines.push(headers.map(escape).join(','))
      }

      // 添加数据行
      lines = [...lines, ...rows.map((r) => r.map(escape).join(','))]

      // 添加表尾
      if (footerRow) {
        lines = [...lines, footerRow.map(escape).join(',')]
      }

      const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
      downloadBlob(blob, `${filename}.csv`)
      break
    }

    case 'txt': {
      let lines: string[] = []

      // 添加表头
      if (includeHeader && headerTitle) {
        lines.push(headerTitle)
      }

      // 添加列标题
      if (includeColumnHeader) {
        lines.push(headers.join('\t'))
      }

      // 添加数据行
      lines = [...lines, ...rows.map((r) => r.map((v) => String(v ?? '')).join('\t'))]

      // 添加表尾
      if (footerRow) {
        lines = [...lines, footerRow.map((v) => String(v ?? '')).join('\t')]
      }

      const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/plain;charset=utf-8;' })
      downloadBlob(blob, `${filename}.txt`)
      break
    }

    case 'html': {
      // 表头（合并单元格的大标题）
      const headerRow = includeHeader && headerTitle
        ? `<tr><th colspan="${headers.length}" style="text-align:center;font-size:16px;font-weight:bold;padding:12px">${escapeHtml(headerTitle)}</th></tr>`
        : ''

      // 列标题
      const columnHeaderRow = includeColumnHeader
        ? `<tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr>`
        : ''

      const thead = headerRow || columnHeaderRow ? `<thead>${headerRow}${columnHeaderRow}</thead>` : ''

      const trs = rows
        .map((r) => `<tr>${r.map((v) => `<td>${escapeHtml(String(v ?? ''))}</td>`).join('')}</tr>`)
        .join('\n')
      const tfoot = footerRow
        ? `<tfoot><tr style="font-weight:bold;background:#f0f0f0">${footerRow.map((v) => `<td>${escapeHtml(String(v ?? ''))}</td>`).join('')}</tr></tfoot>`
        : ''
      const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${escapeHtml(filename)}</title>
<style>table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5;font-weight:bold}tr:nth-child(even){background:#fafafa}</style>
</head><body><table>${thead}<tbody>${trs}</tbody>${tfoot}</table></body></html>`
      const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
      downloadBlob(blob, `${filename}.html`)
      break
    }

    case 'xml': {
      let xmlContent = ''

      // 添加表头
      if (includeHeader && headerTitle) {
        xmlContent += `  <header>${escapeXml(headerTitle)}</header>\n`
      }

      // 添加列标题信息（作为元数据）
      if (includeColumnHeader) {
        const columnNames = headers.map((h, i) => `    <column index="${i}">${escapeXml(h)}</column>`).join('\n')
        xmlContent += `  <columns>\n${columnNames}\n  </columns>\n`
      }

      // 添加数据行
      const xmlRows = rows
        .map((r) => {
          const fields = r
            .map((v, i) => {
              const tag = headers[i]?.replace(/\s+/g, '_') || `field${i}`
              return `    <${tag}>${escapeXml(String(v ?? ''))}</${tag}>`
            })
            .join('\n')
          return `  <row>\n${fields}\n  </row>`
        })
        .join('\n')
      xmlContent += xmlRows

      // 添加表尾
      if (footerRow) {
        const footerFields = footerRow
          .map((v, i) => {
            const tag = headers[i]?.replace(/\s+/g, '_') || `field${i}`
            return `    <${tag}>${escapeXml(String(v ?? ''))}</${tag}>`
          })
          .join('\n')
        xmlContent += `\n  <footer>\n${footerFields}\n  </footer>`
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<data>\n${xmlContent}\n</data>`
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' })
      downloadBlob(blob, `${filename}.xml`)
      break
    }
  }
}
