interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  private isDevelopment = import.meta.env.DEV;

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>) {
    console.error(message, { error, context });
    
    // In production, you might want to send to an error tracking service
    if (!this.isDevelopment) {
      // Send to error tracking service like Sentry
    }
  }

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    if (this.isDevelopment) {
      console.info(message, context);
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (this.isDevelopment) {
      console.debug(message, context);
    }
  }
}

export const logger = new Logger();

export function handleAsyncError(error: unknown, context?: string) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  logger.error(`Async error${context ? ` in ${context}` : ''}:`, error);
  return errorMessage;
}

export function withErrorBoundary<T extends (...args: any[]) => any>(
  fn: T,
  context?: string
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          handleAsyncError(error, context);
          throw error;
        });
      }
      
      return result;
    } catch (error) {
      handleAsyncError(error, context);
      throw error;
    }
  }) as T;
} 