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
    // Console logging
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // Structured error logging - could be sent to Sentry or similar service
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: typeof window !== "undefined" ? window.location.origin + window.location.pathname : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      };

      const existing = JSON.parse(localStorage.getItem("app_error_log") || "[]");
      existing.unshift(errorLog);
      localStorage.setItem("app_error_log", JSON.stringify(existing.slice(0, 10)));
    } catch {
      // Fail silently if localStorage is unavailable
    }
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

export default ErrorBoundary;