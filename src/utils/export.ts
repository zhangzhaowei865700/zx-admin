import * as XLSX from 'xlsx'
import type { ProColumns } from '@ant-design/pro-components'
import i18n from '@/locales'

export type ExportFileType = 'csv' | 'html' | 'xml' | 'txt' | 'xlsx'

export const getFileTypeOptions = (): { value: ExportFileType; label: string }[] => [
  { value: 'csv', label: i18n.t('common:fileTypeCsv') },
  { value: 'html', label: i18n.t('common:fileTypeHtml') },
  { value: 'xml', label: i18n.t('common:fileTypeXml') },
  { value: 'txt', label: i18n.t('common:fileTypeTxt') },
  { value: 'xlsx', label: i18n.t('common:fileTypeXlsx') },
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
  includeHeader: boolean
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
  columns: ProColumns<T>[],
  data: T[],
  options: ExportOptions
) {
  const { headers, rows } = prepareExportData(columns, data, options)
  const { filename, fileType, includeHeader } = options

  switch (fileType) {
    case 'xlsx': {
      const sheetData = includeHeader ? [headers, ...rows] : rows
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(sheetData)
      if (includeHeader) {
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
      const lines = includeHeader
        ? [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))]
        : rows.map((r) => r.map(escape).join(','))
      const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
      downloadBlob(blob, `${filename}.csv`)
      break
    }

    case 'txt': {
      const lines = includeHeader
        ? [headers.join('\t'), ...rows.map((r) => r.map((v) => String(v ?? '')).join('\t'))]
        : rows.map((r) => r.map((v) => String(v ?? '')).join('\t'))
      const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/plain;charset=utf-8;' })
      downloadBlob(blob, `${filename}.txt`)
      break
    }

    case 'html': {
      const ths = includeHeader
        ? `<thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>`
        : ''
      const trs = rows
        .map((r) => `<tr>${r.map((v) => `<td>${escapeHtml(String(v ?? ''))}</td>`).join('')}</tr>`)
        .join('\n')
      const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${escapeHtml(filename)}</title>
<style>table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5;font-weight:bold}tr:nth-child(even){background:#fafafa}</style>
</head><body><table>${ths}<tbody>${trs}</tbody></table></body></html>`
      const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
      downloadBlob(blob, `${filename}.html`)
      break
    }

    case 'xml': {
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
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<data>\n${xmlRows}\n</data>`
      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' })
      downloadBlob(blob, `${filename}.xml`)
      break
    }
  }
}
