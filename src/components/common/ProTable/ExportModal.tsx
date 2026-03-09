import { useState, useMemo } from 'react'
import { Modal, Form, Input, Select, Checkbox, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import type { ProColumns } from '@ant-design/pro-components'
import {
  exportData,
  getExportableColumns,
  getDataIndexKey,
  getFileTypeOptions,
  getDataScopeOptions,
  type ExportFileType,
  type DataScope,
  type ExportOptions,
} from '@/utils/export'

interface ExportModalProps<T extends Record<string, any>> {
  open: boolean
  onClose: () => void
  columns: ProColumns<T>[]
  /** 当前页数据 */
  currentData: T[]
  /** 选中行数据 */
  selectedData: T[]
  /** 获取全量数据的回调 */
  onFetchAllData?: () => Promise<T[]>
  defaultFileName?: string
}

function ExportModal<T extends Record<string, any>>(props: ExportModalProps<T>) {
  const { open, onClose, columns, currentData, selectedData, onFetchAllData, defaultFileName = '' } = props
  const { t } = useTranslation('common')

  const exportableColumns = useMemo(() => getExportableColumns(columns), [columns])

  const allFieldKeys = useMemo(
    () => exportableColumns.map((col) => getDataIndexKey(col.dataIndex as string | string[])),
    [exportableColumns]
  )

  const [filename, setFilename] = useState(defaultFileName)
  const [fileType, setFileType] = useState<ExportFileType>('xlsx')
  const [dataScope, setDataScope] = useState<DataScope>('current')
  const [selectedFields, setSelectedFields] = useState<string[]>(allFieldKeys)
  const [includeHeader, setIncludeHeader] = useState(true)
  const [rawData, setRawData] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleOpen = () => {
    setFilename(defaultFileName)
    setSelectedFields(allFieldKeys)
    setFileType('xlsx')
    setDataScope('current')
    setIncludeHeader(true)
    setRawData(false)
  }

  const checkAll = selectedFields.length === allFieldKeys.length
  const indeterminate = selectedFields.length > 0 && selectedFields.length < allFieldKeys.length

  const handleCheckAllChange = (checked: boolean) => {
    setSelectedFields(checked ? allFieldKeys : [])
  }

  const handleExport = async () => {
    if (selectedFields.length === 0) return

    setExporting(true)
    try {
      let data: T[]
      if (dataScope === 'selected') {
        data = selectedData
      } else if (dataScope === 'all' && onFetchAllData) {
        data = await onFetchAllData()
      } else {
        data = currentData
      }

      const options: ExportOptions = {
        filename: filename || t('exportData'),
        fileType,
        selectedFields,
        includeHeader,
        rawData,
      }
      exportData(columns, data, options)
      onClose()
    } finally {
      setExporting(false)
    }
  }

  return (
    <Modal
      title={t('exportData')}
      open={open}
      onCancel={onClose}
      onOk={handleExport}
      okText={t('export')}
      cancelText={t('cancel')}
      afterOpenChange={(visible) => visible && handleOpen()}
      width={520}
      okButtonProps={{ disabled: selectedFields.length === 0, loading: exporting }}
    >
      <Form layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} style={{ marginTop: 20 }}>
        <Form.Item label={t('fileName')}>
          <Input
            placeholder={t('enterFileName')}
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </Form.Item>

        <Form.Item label={t('saveType')}>
          <Select value={fileType} onChange={setFileType}>
            {getFileTypeOptions().map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={t('selectData')}>
          <Select value={dataScope} onChange={setDataScope}>
            {getDataScopeOptions().map((opt) => (
              <Select.Option
                key={opt.value}
                value={opt.value}
                disabled={opt.value === 'selected' && selectedData.length === 0}
              >
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={t('selectFields')}>
          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              padding: '8px 12px',
              maxHeight: 240,
              overflowY: 'auto',
            }}
          >
            <Checkbox
              checked={checkAll}
              indeterminate={indeterminate}
              onChange={(e) => handleCheckAllChange(e.target.checked)}
              style={{ marginBottom: 8, fontWeight: 500, color: '#1890ff' }}
            >
              {t('allFields')}
            </Checkbox>
            <Checkbox.Group
              value={selectedFields}
              onChange={(val) => setSelectedFields(val as string[])}
              style={{ width: '100%' }}
            >
              <Row>
                {exportableColumns.map((col) => {
                  const key = getDataIndexKey(col.dataIndex as string | string[])
                  return (
                    <Col span={12} key={key} style={{ marginBottom: 4 }}>
                      <Checkbox value={key}>{col.title as string}</Checkbox>
                    </Col>
                  )
                })}
              </Row>
            </Checkbox.Group>
          </div>
        </Form.Item>

        <Form.Item label={t('paramSettings')} style={{ marginBottom: 0 }}>
          <Row gutter={[0, 8]}>
            <Col span={6}>
              <Checkbox checked={includeHeader} onChange={(e) => setIncludeHeader(e.target.checked)}>
                {t('header')}
              </Checkbox>
            </Col>
            <Col span={6}>
              <Checkbox disabled>{t('footer')}</Checkbox>
            </Col>
            <Col span={6}>
              <Checkbox checked={rawData} onChange={(e) => setRawData(e.target.checked)}>
                {t('sourceData')}
              </Checkbox>
            </Col>
            <Col span={6} />
            <Col span={6}>
              <Checkbox disabled>{t('groupHeader')}</Checkbox>
            </Col>
            <Col span={6}>
              <Checkbox disabled>{t('merge')}</Checkbox>
            </Col>
            <Col span={6}>
              <Checkbox disabled>{t('style')}</Checkbox>
            </Col>
            <Col span={6}>
              <Checkbox disabled>{t('expandLevel')}</Checkbox>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export { ExportModal }
