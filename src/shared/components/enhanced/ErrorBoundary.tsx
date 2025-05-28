import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "@/utils/errorHandling";
import { ErrorDisplay } from "@/core/components/ui/composed/error-handler";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Enhanced Error Boundary component that catches JavaScript errors in child components,
 * logs them, and displays a fallback UI
 *
 * Features:
 * - Customizable fallback UI
 * - Error reset functionality
 * - Error logging
 * - Error event callbacks
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    logger.error("Error caught by ErrorBoundary:", {
      error,
      componentStack: errorInfo.componentStack,
    });

    // Call the error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = (): void => {
    // Call onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }

    // Reset the state
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // If a custom fallback is provided, use it
      if (fallback) {
        if (typeof fallback === "function") {
          return fallback(error, this.resetErrorBoundary);
        }
        return fallback;
      }

      // Default fallback UI
      return (
        <ErrorDisplay
          error={error}
          variant="card"
          title="Something went wrong"
          message="An error occurred in a component."
          onRetry={this.resetErrorBoundary}
        />
      );
    }

    return children;
  }
}

/**
 * Route-level Error Boundary for React Router routes
 */
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="flex min-h-[50vh] w-full items-center justify-center p-8">
          <ErrorDisplay
            error={error}
            variant="full"
            title="Route Error"
            message="An error occurred while rendering this page."
            onRetry={reset}
          />
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

/**
 * Utility function to wrap a component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<ErrorBoundaryProps, "children"> = {}
): React.ComponentType<P> {
  const displayName = Component.displayName || Component.name || "Component";

  const ComponentWithErrorBoundary = (props: P) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}
