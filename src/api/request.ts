import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { message } from 'antd'
import { decrypt, encrypt } from '@/utils/crypto'
import { generateSign } from '@/utils/sign'
import { removeUserInfo, getToken } from '@/utils/storage'
import { useUserStore } from '@/stores/useUserStore'
import { broadcastAuthEvent } from '@/utils/authChannel'
import i18n from '@/locales'
import type { ApiResponse } from '@/types'

// 登录相关接口（含切换平台流程）的 401 由调用方处理，不触发全局登出
const AUTH_ENDPOINTS = [
  '/auth/pre-login',
  '/auth/login-platform',
  '/auth/platforms',
  '/auth/switch-platform',
]
const isAuthFlowRequest = (url?: string) => AUTH_ENDPOINTS.some((ep) => url?.includes(ep))

let isHandlingUnauthorized = false
function handleUnauthorized() {
  if (isHandlingUnauthorized) return
  isHandlingUnauthorized = true

  removeUserInfo()
  useUserStore.getState().logout()
  message.error(i18n.t('common:loginExpired'))

  // 先广播给其他标签页
  broadcastAuthEvent('logout')

  // 当前标签页直接跳转，不等待
  const loginPath = import.meta.env.MODE === 'demo'
    ? `${import.meta.env.VITE_BASE_PATH || ''}/#/login`
    : `${import.meta.env.VITE_BASE_PATH || ''}/login`
  window.location.replace(loginPath)
}

const appKey = import.meta.env.VITE_APP_KEY
const appSecret = import.meta.env.VITE_APP_SECRET
const cryptoEnabled = import.meta.env.VITE_CRYPTO_ENABLED === 'true'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
})

service.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {}

    const token = getToken()
    if (token) {
      config.headers.Authorization = token
    }

    if (cryptoEnabled && config.data) {
      config.data = encrypt(config.data)
    }

    const timestamp = Date.now()
    const nonce = Math.random().toString(36).slice(2)
    const body = JSON.stringify(config.data ?? {})

    config.headers['X-App-Key'] = appKey
    config.headers['X-Timestamp'] = String(timestamp)
    config.headers['X-Nonce'] = nonce
    config.headers['X-Sign'] = generateSign({ appKey, timestamp, nonce, body, appSecret })

    return config
  },
  (error) => Promise.reject(error),
)

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse | string>) => {
    let rawPayload: unknown
    try {
      rawPayload = cryptoEnabled ? decrypt(response.data as string) : response.data
    } catch (e) {
      console.error('[request] Decrypt failed:', e)
      message.error(i18n.t('common:responseError'))
      return Promise.reject(new Error('Decrypt failed'))
    }
    if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload)) {
      message.error(i18n.t('common:responseError'))
      return Promise.reject(rawPayload)
    }

    const { code, msg, data } = rawPayload as ApiResponse
    if (code === 200) {
      return data
    }

    if (code === 401) {
      if (!isAuthFlowRequest(response.config.url)) {
        handleUnauthorized()
      }
      return Promise.reject(rawPayload)
    }

    message.error(msg || i18n.t('common:requestFailed'))
    return Promise.reject(rawPayload)
  },
  (error) => {
    if (error?.response?.status === 401) {
      if (!isAuthFlowRequest(error?.config?.url)) {
        handleUnauthorized()
      }
      return Promise.reject(error)
    }

    message.error(error?.message || i18n.t('common:networkError'))
    return Promise.reject(error)
  },
)

const request = <T = unknown>(config: AxiosRequestConfig) => service.request<ApiResponse, T>(config)

export default request
