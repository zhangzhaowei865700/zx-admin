/// <reference types="vite/client" />

declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_CRYPTO_ENABLED: string
  readonly VITE_APP_KEY: string
  readonly VITE_APP_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// View Transition API 类型声明
interface ViewTransition {
  finished: Promise<void>
  ready: Promise<void>
  updateCallbackDone: Promise<void>
}

interface Document {
  startViewTransition?: (callback: () => void) => ViewTransition
}
