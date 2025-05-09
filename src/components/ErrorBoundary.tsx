import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "@/utils/errorHandling";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnRouteChange?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enhanced ErrorBoundary component that provides better error handling
 * and user-friendly fallback UI for React errors
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our error handling system
    logger.error('React Error Boundary caught an error', {
      error,
      errorInfo
    });
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    this.setState({
      errorInfo
    });
  }

  // Reset the error state to allow recovering
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  // Default fallback UI if none is provided
  renderDefaultFallback() {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/30 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-destructive">Something went wrong</h2>
        
        <div className="mb-4">
          <p className="mb-2 text-muted-foreground">
            An error occurred in the application. This is usually a temporary issue.
          </p>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="p-4 bg-card rounded-md mb-4 overflow-auto max-h-40">
              <p className="font-mono text-sm text-destructive">
                {this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={this.resetErrorBoundary} variant="outline">
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()} variant="default">
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      // Render the fallback UI
      return this.props.fallback || this.renderDefaultFallback();
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
