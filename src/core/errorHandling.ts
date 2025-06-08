
import { v4 as uuidv4 } from 'uuid';

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

  trackAction(action: string, data?: Record<string, unknown>) {
    if (this.isDevelopment) {
      console.info(`[ACTION] ${action}`, data);
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

// Error tracking utilities
export interface ErrorReport {
  id: string;
  timestamp: Date;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId: string;
}

class ErrorTracker {
  private reports: ErrorReport[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = uuidv4();
  }

  track(error: Error | string, context?: Record<string, unknown>, userId?: string): string {
    const id = uuidv4();
    const report: ErrorReport = {
      id,
      timestamp: new Date(),
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' && error.stack ? error.stack : undefined,
      context,
      userId,
      sessionId: this.sessionId,
    };

    this.reports.push(report);
    logger.error('Error tracked', report);

    // In production, send to error tracking service
    if (!import.meta.env.DEV) {
      this.sendToErrorService(report);
    }

    return id;
  }

  private sendToErrorService(report: ErrorReport) {
    // Implementation for sending to error tracking service (e.g., Sentry)
    console.info('Would send error report to service:', report);
  }

  getReports(): ErrorReport[] {
    return [...this.reports];
  }

  clearReports(): void {
    this.reports = [];
  }
}

export const errorTracker = new ErrorTracker();

// Global error handler
export function setupGlobalErrorHandling() {
  window.addEventListener('error', (event) => {
    errorTracker.track(event.error || event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
    errorTracker.track(error, { type: 'unhandled_promise_rejection' });
  });
}

// Enhanced error boundary utilities
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export function createErrorBoundaryReducer() {
  return (state: ErrorBoundaryState, action: { type: 'ERROR' | 'RESET'; error?: Error }): ErrorBoundaryState => {
    switch (action.type) {
      case 'ERROR':
        const errorId = action.error ? errorTracker.track(action.error) : uuidv4();
        return {
          hasError: true,
          error: action.error,
          errorId,
        };
      case 'RESET':
        return {
          hasError: false,
          error: undefined,
          errorId: undefined,
        };
      default:
        return state;
    }
  };
}

// Performance monitoring
export class PerformanceMonitor {
  private measurements: Record<string, number> = {};

  start(label: string): void {
    this.measurements[label] = performance.now();
  }

  end(label: string): number {
    const startTime = this.measurements[label];
    if (startTime === undefined) {
      logger.warn(`Performance measurement '${label}' was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    delete this.measurements[label];
    
    logger.debug(`Performance: ${label} took ${duration.toFixed(2)}ms`);
    return duration;
  }

  measure<T>(label: string, fn: () => T): T {
    this.start(label);
    try {
      const result = fn();
      this.end(label);
      return result;
    } catch (error) {
      this.end(label);
      throw error;
    }
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    try {
      const result = await fn();
      this.end(label);
      return result;
    } catch (error) {
      this.end(label);
      throw error;
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
