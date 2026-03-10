import React from 'react'
import { Button, Result, Space } from 'antd'
import i18n from '@/locales'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title={i18n.t('common:errorPage')}
          subTitle={this.state.error?.message || i18n.t('common:errorPageDesc')}
          extra={
            <Space>
              <Button type="primary" onClick={() => this.setState({ hasError: false, error: null })}>
                {i18n.t('common:retry')}
              </Button>
              <Button onClick={() => window.location.reload()}>
                {i18n.t('common:refresh') || '刷新页面'}
              </Button>
            </Space>
          }
        />
      )
    }

    return this.props.children
  }
}
