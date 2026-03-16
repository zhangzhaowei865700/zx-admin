import { ModalForm, DrawerForm } from '@ant-design/pro-components'
import type { ModalFormProps, DrawerFormProps } from '@ant-design/pro-components'
import { useAppStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { FORM_SIZE_MAP, type FormSizePreset } from '@/constants/ui'

type FormContainerProps = ModalFormProps & DrawerFormProps & {
  formSize?: FormSizePreset
}

export const FormContainer: React.FC<FormContainerProps> = (props) => {
  const { formDisplayMode, formColumns, formSizePreset, formLabelAlign, formComponentSize, formColon, formLayout } = useAppStore(useShallow((s) => ({
    formDisplayMode: s.formDisplayMode,
    formColumns: s.formColumns,
    formSizePreset: s.formSizePreset,
    formLabelAlign: s.formLabelAlign,
    formComponentSize: s.formComponentSize,
    formColon: s.formColon,
    formLayout: s.formLayout,
  })))

  const isDrawer = formDisplayMode === 'drawer'
  const Form = isDrawer ? DrawerForm : ModalForm

  const sizeKey = props.formSize ?? formSizePreset
  const defaultWidth = isDrawer
    ? FORM_SIZE_MAP[sizeKey].drawer
    : FORM_SIZE_MAP[sizeKey].modal

  // 过滤掉不属于当前模式的 props
  const { modalProps, drawerProps, formSize, ...restProps } = props

  const containerProps = isDrawer
    ? { drawerProps: { destroyOnClose: true, width: defaultWidth, ...drawerProps } }
    : { modalProps: { destroyOnClose: true, centered: true, width: defaultWidth, ...modalProps } }

  const gridProps = formColumns === 2
    ? { grid: true as const, colProps: { span: 12, ...props.colProps } }
    : {}

  // 水平布局时需要设置 labelCol，标签对齐才会生效
  const layoutProps = formLayout === 'horizontal'
    ? {
      layout: formLayout,
      labelAlign: formLabelAlign,
      ...(formLabelAlign === 'left'
        ? { labelCol: { flex: '0 0 auto' }, wrapperCol: { flex: 1 }, labelWrap: true }
        : { labelCol: { flex: '0 0 100px' } }),
    }
    : { layout: formLayout }

  return <Form {...restProps} {...containerProps} {...gridProps} {...layoutProps} size={formComponentSize} colon={formColon} />
}
