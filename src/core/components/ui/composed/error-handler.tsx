import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/core/components/ui/primitives/alert";
import { Button } from "@/core/components/ui/button";
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card";
import { cn } from "@/shared/utils";
import { logger } from '@/utils/errorHandling';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  error?: Error | unknown;
  variant?: 'inline' | 'card' | 'full';
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * A standardized error display component for showing errors consistently across the app
 */
export function ErrorDisplay({
  title = 'An error occurred',
  message = 'There was an error processing your request.',
  error,
  variant = 'inline',
  onRetry,
  onDismiss,
  className
}: ErrorDisplayProps) {
  // Try to extract a user-friendly error message
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : message;

  // Log the error to help with debugging
  useEffect(() => {
    if (error) {
      logger.error('ErrorDisplay caught an error:', error);
    }
  }, [error]);

  // For inline variant (simplest)
  if (variant === 'inline') {
    return (
      <Alert variant="destructive" className={cn("border-destructive/50", className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          {errorMessage}
          
          <div className="mt-3 flex gap-2">
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry} className="h-7 px-2 text-xs">
                <RefreshCw className="mr-1 h-3 w-3" />
                Retry
              </Button>
            )}
            {onDismiss && (
              <Button size="sm" variant="ghost" onClick={onDismiss} className="h-7 px-2 text-xs">
                <XCircle className="mr-1 h-3 w-3" />
                Dismiss
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // For card variant (more detailed)
  if (variant === 'card') {
    return (
      <Card className={cn("border-destructive/50", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
          
          {process.env.NODE_ENV === 'development' && error instanceof Error && error.stack && (
            <pre className="mt-2 max-h-[200px] overflow-auto rounded bg-muted p-2 text-xs">
              {error.stack}
            </pre>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-2">
          {onDismiss && (
            <Button variant="ghost" onClick={onDismiss} size="sm">
              Dismiss
            </Button>
          )}
          {onRetry && (
            <Button variant="default" onClick={onRetry} size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // For full variant (centered on the screen)
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Card className={cn("border-destructive/50 shadow-lg", className)}>
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-center">{title}</CardTitle>
            <CardDescription className="text-center">{message}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center text-muted-foreground">{errorMessage}</p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 pt-2">
            {onDismiss && (
              <Button variant="outline" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
            {onRetry && (
              <Button variant="default" onClick={onRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

/**
 * A component to handle async operations with loading and error states
 */
export function AsyncStateHandler<T>({
  loading,
  error,
  data,
  onRetry,
  loadingComponent,
  errorComponent,
  children,
}: {
  loading: boolean;
  error?: Error | unknown;
  data?: T;
  onRetry?: () => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  children: (data: T) => React.ReactNode;
}) {
  if (loading) {
    return loadingComponent || <div className="py-4 text-center">Loading...</div>;
  }

  if (error) {
    return errorComponent || (
      <ErrorDisplay 
        error={error} 
        onRetry={onRetry}
        variant="inline"
      />
    );
  }

  if (!data) {
    return <div className="py-4 text-center">No data available</div>;
  }

  return <>{children(data)}</>;
} 