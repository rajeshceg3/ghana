"use client"

import { Component, ErrorInfo, ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export class MapErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-amber-50 p-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong with the map</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            We encountered an error while loading the map. This might be due to a connection issue or a temporary glitch.
          </p>
          <Button
            onClick={() => this.setState({ hasError: false })}
            variant="outline"
            className="border-amber-200 text-amber-900 hover:bg-amber-100"
          >
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
