import { useState, useEffect } from 'react'
import { Card, Form, Input, Switch, Button, message, Upload, Divider } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/common/PageContainer'
import { PageSkeleton } from '@/components/common/PageSkeleton'
import { HasPermission } from '@/components/common/HasPermission'
import { getStoreSetting, updateStoreSetting } from '@/api/modules/tenant'
import type { StoreSetting } from '@/types'

export const TenantSettingPage: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<StoreSetting>()
  const { t } = useTranslation(['tenant', 'common'])

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const data = await getStoreSetting()
        setInitialValues(data)
      } finally {
        setInitialLoading(false)
      }
    }
    fetchSetting()
  }, [])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      await updateStoreSetting(values as StoreSetting)
      message.success(t('common:saveSuccess'))
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <PageContainer>
        <Card>
          <PageSkeleton type="detail" />
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: 600 }}
          initialValues={initialValues}
        >
          <Divider orientation="left">{t('tenant:setting.basicInfo')}</Divider>
          <Form.Item name="storeName" label={t('tenant:setting.storeName')} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="storeDesc" label={t('tenant:setting.storeDesc')}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="storeLogo" label={t('tenant:setting.storeLogo')} valuePropName="fileList" getValueFromEvent={(e: { fileList: unknown[] }) => e?.fileList ?? e} getValueProps={(value) => ({ fileList: Array.isArray(value) ? value : [] })}>
            <Upload maxCount={1} listType="picture" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>{t('tenant:setting.uploadImage')}</Button>
            </Upload>
          </Form.Item>

          <Divider orientation="left">{t('tenant:setting.contactInfo')}</Divider>
          <Form.Item name="contactPhone" label={t('tenant:setting.contactPhoneLabel')}>
            <Input />
          </Form.Item>
          <Form.Item name="contactEmail" label={t('tenant:setting.contactEmail')}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label={t('tenant:setting.storeAddress')}>
            <Input.TextArea rows={2} />
          </Form.Item>

          <Divider orientation="left">{t('tenant:setting.businessSettings')}</Divider>
          <Form.Item name="isOpen" label={t('tenant:setting.businessStatus')} valuePropName="checked">
            <Switch checkedChildren={t('tenant:setting.open')} unCheckedChildren={t('tenant:setting.closed')} />
          </Form.Item>
          <Form.Item name="autoConfirm" label={t('tenant:setting.autoAcceptOrder')} valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <HasPermission code="tenant:admin:setting:update">
              <Button type="primary" loading={loading} onClick={handleSave}>
                {t('tenant:setting.saveSettings')}
              </Button>
            </HasPermission>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  )
}
