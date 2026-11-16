"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

type Props = {
  children: ReactNode
  onError?: (error: Error) => void
}

type State = {
  error: Error | null
}

export class SphereBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.error) return null
    return this.props.children
  }
}
