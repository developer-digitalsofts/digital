import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  title?: string
}

type State = { error: Error | null }

/** Catches render errors in admin tab panels so the layout never goes fully blank. */
export class AdminPanelErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AdminPanelErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-900">
          <p className="font-bold">{this.props.title ?? 'This section could not be displayed'}</p>
          <p className="mt-2 text-red-800">
            Something went wrong while loading the form. Try refreshing the page. If the problem continues, check that the CMS
            API is running.
          </p>
          <p className="mt-3 font-mono text-xs text-red-700/90">{this.state.error.message}</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-800 ring-1 ring-red-200 hover:bg-red-100"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
