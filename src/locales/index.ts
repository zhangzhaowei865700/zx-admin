import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import zhCNCommon from './zh-CN/common.json'
import zhCNMenu from './zh-CN/menu.json'
import zhCNLogin from './zh-CN/login.json'
import zhCNSystem from './zh-CN/system.json'
import zhCNTenant from './zh-CN/tenant.json'
import zhCNOrder from './zh-CN/order.json'
import zhCNProduct from './zh-CN/product.json'
import zhCNSettings from './zh-CN/settings.json'
import zhCNMessage from './zh-CN/message.json'

import enUSCommon from './en-US/common.json'
import enUSMenu from './en-US/menu.json'
import enUSLogin from './en-US/login.json'
import enUSSystem from './en-US/system.json'
import enUSTenant from './en-US/tenant.json'
import enUSOrder from './en-US/order.json'
import enUSProduct from './en-US/product.json'
import enUSSettings from './en-US/settings.json'
import enUSMessage from './en-US/message.json'

import jaJPCommon from './ja-JP/common.json'
import jaJPMenu from './ja-JP/menu.json'
import jaJPLogin from './ja-JP/login.json'
import jaJPSystem from './ja-JP/system.json'
import jaJPTenant from './ja-JP/tenant.json'
import jaJPOrder from './ja-JP/order.json'
import jaJPProduct from './ja-JP/product.json'
import jaJPSettings from './ja-JP/settings.json'
import jaJPMessage from './ja-JP/message.json'

export const resources = {
  'zh-CN': {
    common: zhCNCommon,
    menu: zhCNMenu,
    login: zhCNLogin,
    system: zhCNSystem,
    tenant: zhCNTenant,
    order: zhCNOrder,
    product: zhCNProduct,
    settings: zhCNSettings,
    message: zhCNMessage,
  },
  'en-US': {
    common: enUSCommon,
    menu: enUSMenu,
    login: enUSLogin,
    system: enUSSystem,
    tenant: enUSTenant,
    order: enUSOrder,
    product: enUSProduct,
    settings: enUSSettings,
    message: enUSMessage,
  },
  'ja-JP': {
    common: jaJPCommon,
    menu: jaJPMenu,
    login: jaJPLogin,
    system: jaJPSystem,
    tenant: jaJPTenant,
    order: jaJPOrder,
    product: jaJPProduct,
    settings: jaJPSettings,
    message: jaJPMessage,
  },
}

export const LANGUAGE_OPTIONS = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
  { value: 'ja-JP', label: '日本語' },
] as const

export type LocaleType = 'zh-CN' | 'en-US' | 'ja-JP'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-CN',
    defaultNS: 'common',
    ns: ['common', 'menu', 'login', 'system', 'tenant', 'order', 'product', 'settings', 'message'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'app-locale',
      caches: ['localStorage'],
    },
  })

export default i18n
