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

const MAX_ERROR_LOGS = 10;
const LOG_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const ERROR_LOG_KEY = "app_error_log";

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      retryLimitReached: false,
    };
    this.clearExpiredLogs();
  }

  private clearExpiredLogs(): void {
    try {
      const existing = JSON.parse(
        localStorage.getItem(ERROR_LOG_KEY) || "[]"
      );
      const now = Date.now();
      const fresh = existing.filter((log: { timestamp: string }) => {
        return now - new Date(log.timestamp).getTime() < LOG_EXPIRY_MS;
      });
      if (fresh.length !== existing.length) {
        localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(fresh));
      }
    } catch {
    }
  }

  static clearAllLogs(): void {
    try {
      localStorage.removeItem(ERROR_LOG_KEY);
    } catch {
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState((prev) => ({
      retryCount: prev.retryCount + 1,
    }));

    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url:
          typeof window !== "undefined"
            ? window.location.origin + window.location.pathname
            : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      };
      this.clearExpiredLogs();
      const existing = JSON.parse(
        localStorage.getItem(ERROR_LOG_KEY) || "[]"
      );
      existing.unshift(errorLog);
      localStorage.setItem(
        ERROR_LOG_KEY,
        JSON.stringify(existing.slice(0, MAX_ERROR_LOGS))
      );
    } catch {
    }

    this.setState({ errorInfo });
  }

  handleRetry = () => {
    const { retryCount } = this.state;

    if (retryCount >= 3) {
      ErrorBoundary.clearAllLogs();
      this.setState({ retryLimitReached: true });
      window.location.reload();
      return;
    }

    this.setState((prev) => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prev.retryCount,
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