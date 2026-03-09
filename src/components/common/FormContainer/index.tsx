import { ModalForm, DrawerForm } from '@ant-design/pro-components'
import type { ModalFormProps, DrawerFormProps } from '@ant-design/pro-components'
import { useAppStore } from '@/stores'

type FormContainerProps = ModalFormProps & DrawerFormProps

export const FormContainer: React.FC<FormContainerProps> = (props) => {
  const { formDisplayMode, formColumns } = useAppStore()

  const isDrawer = formDisplayMode === 'drawer'
  const Form = isDrawer ? DrawerForm : ModalForm

  const containerProps = isDrawer
    ? { drawerProps: { destroyOnClose: true, ...props.drawerProps } }
    : { modalProps: { destroyOnClose: true, centered: true, ...props.modalProps } }

  const gridProps = formColumns === 2
    ? { grid: true as const, colProps: { span: 12, ...props.colProps } }
    : {}

  return <Form {...props} {...containerProps} {...gridProps} />
}
