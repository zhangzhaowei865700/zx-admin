/** 字典类型 */
export interface DictType {
  id: number
  /** 字典类型编码，如 'order_status', 'gender' */
  code: string
  /** 字典类型名称 */
  name: string
  /** 备注 */
  remark?: string
}

/** 字典项 */
export interface DictItem {
  id: number
  /** 所属字典类型编码 */
  dictType: string
  /** 字典项值 */
  value: string | number
  /** 字典项标签 */
  label: string
  /** 标签颜色（用于 Tag 展示） */
  color?: string
  /** 排序 */
  sort?: number
}
