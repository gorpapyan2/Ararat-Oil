// Moved from src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // Update state with error details
    this.setState({ errorInfo });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // If a fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Otherwise render a default error fallback UI
      return (
        <div
          className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800"
          style={{ margin: "2rem auto", maxWidth: "90%" }}
        >
          <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">
            Something went wrong
          </h2>

          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded dark:bg-gray-700 dark:border-gray-600">
            {error?.toString()}
          </div>

          {process.env.NODE_ENV !== "production" && errorInfo && (
            <details className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded dark:bg-gray-700 dark:border-gray-600">
              <summary className="cursor-pointer mb-2 font-medium">
                Component Stack Trace
              </summary>
              <pre className="text-sm overflow-auto p-2">
                {errorInfo.componentStack}
              </pre>
            </details>
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Reload Page
            </button>

            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return children;
  }
}

export default ErrorBoundary;
