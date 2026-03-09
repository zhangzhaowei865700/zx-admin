export { usePagination, useSearchParams } from './useCommon'
export { usePermission } from './usePermission'
export { useFormModal } from './useFormModal'
export { usePolling } from './usePolling'
export { useDictionary } from './useDictionary'
export { useVersionCheck } from './useVersionCheck'
export type { UsePollingOptions } from './usePolling'

// re-export commonly used ahooks
export {
  useDebounce,
  useDebounceFn,
  useThrottle,
  useThrottleFn,
  useLocalStorageState,
  useMount,
  useUnmount,
  useUpdateEffect,
  useClickAway,
  useKeyPress,
} from 'ahooks'
