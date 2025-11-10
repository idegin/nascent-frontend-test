import { Component, ReactNode, ErrorInfo } from 'react'
import SectionPlaceholder from './SectionPlaceholder'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <SectionPlaceholder
              type="error"
              title="Something went wrong"
              description="An unexpected error occurred. Please try refreshing the page or contact support if the problem persists."
              actionLabel="Reload Page"
              onAction={this.handleReset}
            />
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
