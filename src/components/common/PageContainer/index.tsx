import { PageContainer as ProPageContainer } from '@ant-design/pro-components'

interface PageContainerProps {
  title?: string
  children?: React.ReactNode
  [key: string]: any
}

export const PageContainer: React.FC<PageContainerProps> = (props) => {
  return <ProPageContainer {...props} />
}
