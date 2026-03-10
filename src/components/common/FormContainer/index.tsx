import { ModalForm, DrawerForm } from '@ant-design/pro-components'
import type { ModalFormProps, DrawerFormProps } from '@ant-design/pro-components'
import { useAppStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'
import { FORM_SIZE_MAP, type FormSizePreset } from '@/constants/ui'

type FormContainerProps = ModalFormProps & DrawerFormProps & {
  formSize?: FormSizePreset
}

export const FormContainer: React.FC<FormContainerProps> = (props) => {
  const { formDisplayMode, formColumns, formSizePreset } = useAppStore(useShallow((s) => ({ formDisplayMode: s.formDisplayMode, formColumns: s.formColumns, formSizePreset: s.formSizePreset })))

  const isDrawer = formDisplayMode === 'drawer'
  const Form = isDrawer ? DrawerForm : ModalForm

  const sizeKey = props.formSize ?? formSizePreset
  const defaultWidth = isDrawer
    ? FORM_SIZE_MAP[sizeKey].drawer
    : FORM_SIZE_MAP[sizeKey].modal

  const containerProps = isDrawer
    ? { drawerProps: { destroyOnClose: true, width: defaultWidth, ...props.drawerProps } }
    : { modalProps: { destroyOnClose: true, centered: true, width: defaultWidth, ...props.modalProps } }

  const gridProps = formColumns === 2
    ? { grid: true as const, colProps: { span: 12, ...props.colProps } }
    : {}

  return <Form {...props} {...containerProps} {...gridProps} />
}
