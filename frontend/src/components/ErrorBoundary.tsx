import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error caught by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 border border-red-200 bg-red-50 rounded-xl text-center shadow-sm my-2">
          <p className="text-red-600 font-semibold text-sm flex items-center justify-center gap-2">
            ⚠️ Failed to load this component
          </p>
          <p className="text-xs text-red-500 mt-1">
            An unexpected data parsing error occurred.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}