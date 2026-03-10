import type { PageParams } from '../index'

export interface ProductParams extends PageParams {
  name?: string
  category?: string
  status?: number
}
