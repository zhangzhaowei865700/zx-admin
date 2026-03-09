import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { message } from 'antd'
import { decrypt, encrypt } from '@/utils/crypto'
import { generateSign } from '@/utils/sign'
import { getToken, removeToken, removeUserInfo } from '@/utils/storage'
import i18n from '@/locales'
import type { ApiResponse } from './types'

let isRedirecting = false
function handleUnauthorized() {
  if (isRedirecting) return
  isRedirecting = true
  removeToken()
  removeUserInfo()
  message.error(i18n.t('common:loginExpired'))
  setTimeout(() => {
    const basename = import.meta.env.VITE_BASE_PATH || ''
    window.location.href = `${basename}/login`
  }, 300)
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
    const rawPayload = cryptoEnabled ? decrypt(response.data as string) : response.data
    if (!rawPayload || typeof rawPayload !== 'object') {
      message.error(i18n.t('common:responseError'))
      return Promise.reject(rawPayload)
    }

    const { code, msg, data } = rawPayload as ApiResponse
    if (code === 200) {
      return data
    }

    if (code === 401) {
      handleUnauthorized()
      return Promise.reject(rawPayload)
    }

    message.error(msg || i18n.t('common:requestFailed'))
    return Promise.reject(rawPayload)
  },
  (error) => {
    if (error?.response?.status === 401) {
      handleUnauthorized()
      return Promise.reject(error)
    }

    message.error(error?.message || i18n.t('common:networkError'))
    return Promise.reject(error)
  },
)

const request = <T = unknown>(config: AxiosRequestConfig) => service.request<any, T>(config)

export default request
