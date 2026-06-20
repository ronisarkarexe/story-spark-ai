import React, { Component, ErrorInfo, ReactNode } from "react";
import ErrorPage from "./ErrorPage";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  retryLimitReached: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      retryCount: 0,
      retryLimitReached: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Track retry count across errors
    this.setState((prev) => ({
      retryCount: prev.retryCount + 1,
    }));

    // Console logging
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // Structured error logging - could be sent to Sentry or similar service
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        // Path only, no query string, so tokens or PII in params are not persisted.
        url:
          typeof window !== "undefined"
            ? window.location.origin + window.location.pathname
            : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      };

      // Try to persist to localStorage for diagnostics
      const existing = JSON.parse(
        localStorage.getItem("app_error_log") || "[]"
      );
      existing.unshift(errorLog);
      localStorage.setItem(
        "app_error_log",
        JSON.stringify(existing.slice(0, 10))
      );
    } catch {
      // Fail silently if localStorage is unavailable
    }

    this.setState({ errorInfo });
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    
    // Cap retries at 3 to prevent infinite loops
    if (retryCount >= 3) {
      this.setState({ retryLimitReached: true });
      window.location.reload();
      return;
    }

    // Clear error boundary state to retry
    this.setState((prev) => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    }));
  };

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
