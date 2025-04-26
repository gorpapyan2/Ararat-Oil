import React, { Component, ErrorInfo, ReactNode } from 'react';
import logger from '@/services/logger';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to our logger service which sends it to Sentry
    logger.error(error, { errorInfo });
    
    this.setState({
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background text-foreground">
          <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-4">
                An unexpected error occurred. Our team has been notified.
              </p>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-4 bg-secondary/20 p-3 rounded-md open:pb-3">
                <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
                  Error details (for developers)
                </summary>
                <div className="text-xs overflow-auto max-h-[300px] bg-muted p-3 rounded-md font-mono">
                  <p className="mb-2 text-destructive">{this.state.error?.toString()}</p>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                </div>
              </details>
            )}
            
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={this.handleGoHome}>
                Go Home
              </Button>
              <Button onClick={this.handleReload}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 