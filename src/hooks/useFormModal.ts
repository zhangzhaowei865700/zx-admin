import { useState, useCallback } from 'react'

/**
 * 表单弹窗状态管理 Hook
 *
 * 统一管理 open / currentRecord / isEdit 三个关联状态，
 * 避免每个 CRUD 页面重复定义相同的 useState 组合。
 *
 * @example
 * ```tsx
 * const { open, setOpen, currentRecord, isEdit, openModal, closeModal } = useFormModal<User>()
 *
 * // 新增：不传 record
 * <Button onClick={() => openModal()}>新增</Button>
 *
 * // 编辑：传入当前行记录
 * <a onClick={() => openModal(record)}>编辑</a>
 *
 * // 绑定到 FormContainer
 * <FormContainer
 *   open={open}
 *   onOpenChange={setOpen}
 *   initialValues={currentRecord}
 *   title={isEdit ? '编辑' : '新增'}
 * />
 * ```
 */
export function useFormModal<T = Record<string, unknown>>() {
  const [open, setOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<T>()

  /** 打开弹窗。传入 record 为编辑模式，不传为新增模式 */
  const openModal = useCallback((record?: T) => {
    setCurrentRecord(record)
    setOpen(true)
  }, [])

  /** 关闭弹窗并清空当前记录 */
  const closeModal = useCallback(() => {
    setOpen(false)
    setCurrentRecord(undefined)
  }, [])

  return {
    open,
    /** 直接控制 open 状态（用于 FormContainer 的 onOpenChange 回调） */
    setOpen,
    /** 当前正在编辑的记录，新增时为 undefined */
    currentRecord,
    /** 是否为编辑模式 */
    isEdit: !!currentRecord,
    openModal,
    closeModal,
  }
}
