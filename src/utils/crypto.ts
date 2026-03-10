import CryptoJS from 'crypto-js'

const CRYPTO_KEY = import.meta.env.VITE_APP_SECRET
if (!CRYPTO_KEY) {
  console.warn('[crypto] VITE_APP_SECRET is not set. Encryption/decryption will not work correctly.')
}

export function encrypt<T = unknown>(data: T): string {
  const jsonString = JSON.stringify(data)
  const encrypted = CryptoJS.AES.encrypt(jsonString, CRYPTO_KEY).toString()
  return encrypted
}

export function decrypt<T = unknown>(encryptedData: string): T {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, CRYPTO_KEY)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    if (!decryptedString) {
      throw new Error('Decryption produced empty result')
    }
    return JSON.parse(decryptedString) as T
  } catch (error) {
    console.error('[crypto] Decryption failed:', error)
    throw new Error('Failed to decrypt data')
  }
}
