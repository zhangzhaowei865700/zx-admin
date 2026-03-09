import { useState, useEffect } from 'react'
import { Card, Form, Input, Switch, Button, message, Upload, Divider, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '@/components/common/PageContainer'
import { getStoreSetting, updateStoreSetting } from '@/api/modules/tenant'
import type { StoreSetting } from '@/types/tenant'

export const TenantSettingPage: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const { t } = useTranslation(['tenant', 'common'])

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const data = await getStoreSetting()
        form.setFieldsValue(data)
      } finally {
        setInitialLoading(false)
      }
    }
    fetchSetting()
  }, [form])

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

  return (
    <PageContainer>
      <Card>
        <Spin spinning={initialLoading}>
          <Form
            form={form}
            layout="vertical"
            style={{ maxWidth: 600 }}
          >
            <Divider orientation="left">{t('tenant:setting.basicInfo')}</Divider>
            <Form.Item name="storeName" label={t('tenant:setting.storeName')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="storeDesc" label={t('tenant:setting.storeDesc')}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="storeLogo" label={t('tenant:setting.storeLogo')}>
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
              <Button type="primary" loading={loading} onClick={handleSave}>
                {t('tenant:setting.saveSettings')}
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </PageContainer>
  )
}
