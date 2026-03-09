import CryptoJS from 'crypto-js'

const CRYPTO_KEY = import.meta.env.VITE_APP_SECRET || 'default-key'

export function encrypt(data: any): string {
  const jsonString = JSON.stringify(data)
  const encrypted = CryptoJS.AES.encrypt(jsonString, CRYPTO_KEY).toString()
  return encrypted
}

export function decrypt(encryptedData: string): any {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, CRYPTO_KEY)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedString)
  } catch {
    return encryptedData
  }
}
