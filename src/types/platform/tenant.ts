import type { PageParams } from '../index'

export interface TenantParams extends PageParams {
  name?: string
  status?: number
}
