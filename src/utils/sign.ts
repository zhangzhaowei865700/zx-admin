import CryptoJS from 'crypto-js'

interface SignParams {
  appKey: string
  timestamp: number
  nonce: string
  body: string
  appSecret: string
}

export function generateSign(params: SignParams): string {
  const { appKey, timestamp, nonce, body, appSecret } = params
  const signString = [appKey, timestamp, nonce, body, appSecret].join('|')
  return CryptoJS.SHA256(signString).toString()
}
