import React from 'react'
import { Button, Result } from 'antd'
import i18n from '@/locales'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title={i18n.t('common:errorPage')}
          subTitle={i18n.t('common:errorPageDesc')}
          extra={
            <Button type="primary" onClick={() => this.setState({ hasError: false })}>
              {i18n.t('common:retry')}
            </Button>
          }
        />
      )
    }

    return this.props.children
  }
}
