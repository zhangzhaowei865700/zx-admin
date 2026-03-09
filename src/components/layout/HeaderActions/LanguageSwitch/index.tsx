import { Dropdown } from 'antd'
import { TranslationOutlined } from '@ant-design/icons'
import { useAppStore } from '@/stores'
import { LANGUAGE_OPTIONS } from '@/locales'
import type { LocaleType } from '@/locales'
import { ActionIcon } from '../ActionIcon'

export const LanguageSwitch: React.FC = () => {
  const { locale, setLocale } = useAppStore()

  return (
    <Dropdown
      menu={{
        items: LANGUAGE_OPTIONS.map((lang) => ({
          key: lang.value,
          label: lang.label,
          disabled: locale === lang.value,
        })),
        onClick: ({ key }) => setLocale(key as LocaleType),
        selectedKeys: [locale],
      }}
      trigger={['click']}
    >
      <ActionIcon>
        <TranslationOutlined />
      </ActionIcon>
    </Dropdown>
  )
}
