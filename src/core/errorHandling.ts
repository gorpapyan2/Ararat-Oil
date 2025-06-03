import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMessage {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: unknown;
  componentStack?: string;
}

// Common React error patterns to filter out from console if desired
const COMMON_REACT_ERRORS = [
  // React 18 Strict Mode double mounting warnings
  /Warning: ReactDOM.render is no longer supported in React 18/,
  /Warning: findDOMNode is deprecated in StrictMode/,
  /Warning: Cannot update a component .* while rendering a different component/,
  // useLayoutEffect SSR warning
  /Warning: useLayoutEffect does nothing on the server/,
  // Suspense fallback warnings
  /Warning: Did not expect server HTML to contain a/,
  // React Router warnings
  /No routes matched location/,
  // React-Query related warnings
  /Warning: An unhandled error was caught from submitForm/,
  // Material-UI / Styled Components
  /Warning: Prop .* did not match/,
  // Invalid DOM nesting
  /Warning: validateDOMNesting/,
];

class Logger {
  private logs: LogMessage[] = [];
  private maxLogs: number = 100;
  private consoleEnabled: boolean = true;
  private filterPatterns: RegExp[] = [];

  constructor() {
    this.setupConsoleOverrides();
  }

  /**
   * Enable or disable console logging (errors will still be tracked internally)
   */
  public enableConsole(enabled: boolean): void {
    this.consoleEnabled = enabled;
  }

  /**
   * Add filters to suppress specific console errors that match patterns
   */
  public addFilters(patterns: RegExp[]): void {
    this.filterPatterns = [...this.filterPatterns, ...patterns];
  }

  /**
   * Remove all filters
   */
  public clearFilters(): void {
    this.filterPatterns = [];
  }

  /**
   * Enable filtering of common React warnings/errors
   */
  public filterReactWarnings(enable: boolean): void {
    if (enable) {
      this.addFilters(COMMON_REACT_ERRORS);
    } else {
      this.clearFilters();
    }
  }

  /**
   * Log a debug message
   */
  public debug(message: string, details?: unknown): string {
    return this.log("debug", message, details);
  }

  /**
   * Log an info message
   */
  public info(message: string, details?: unknown): string {
    return this.log("info", message, details);
  }

  /**
   * Log a warning message
   */
  public warn(message: string, details?: unknown): string {
    return this.log("warn", message, details);
  }

  /**
   * Log an error message
   */
  public error(message: string, details?: unknown): string {
    return this.log("error", message, details);
  }

  /**
   * Get all logs (for debugging or displaying in a log viewer)
   */
  public getLogs(): LogMessage[] {
    return [...this.logs];
  }

  /**
   * Clear all stored logs
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get logs of a specific level
   */
  public getLogsByLevel(level: LogLevel): LogMessage[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, details?: unknown): string {
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    // Check if this error should be filtered
    if (level === "error" || level === "warn") {
      const messageString = String(message);
      if (this.shouldFilterError(messageString)) {
        // Still track internally but don't console log
        const logEntry: LogMessage = { id, timestamp, level, message, details };
        this.addLogEntry(logEntry);
        return id;
      }
    }

    // Log to console if enabled
    if (this.consoleEnabled) {
      if (level === "debug") console.debug(message, details ?? "");
      if (level === "info") console.info(message, details ?? "");
      if (level === "warn") console.warn(message, details ?? "");
      if (level === "error") console.error(message, details ?? "");
    }

    // Track internally
    const logEntry: LogMessage = { id, timestamp, level, message, details };
    this.addLogEntry(logEntry);

    return id;
  }

  /**
   * Add log entry to internal storage with limit
   */
  private addLogEntry(entry: LogMessage): void {
    this.logs.push(entry);

    // Remove oldest logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Check if an error message should be filtered
   */
  private shouldFilterError(message: string): boolean {
    return this.filterPatterns.some((pattern) => pattern.test(message));
  }

  /**
   * Override console methods to track all console output
   */
  private setupConsoleOverrides(): void {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    // Override console.error
    console.error = (...args: unknown[]) => {
      const message = args[0]?.toString() || "Error";
      const details = args.length > 1 ? args.slice(1) : undefined;

      // Check if this error should be filtered
      if (this.shouldFilterError(message)) {
        // Still track internally but don't console log
        const id = uuidv4();
        const timestamp = new Date().toISOString();
        const logEntry: LogMessage = {
          id,
          timestamp,
          level: "error",
          message,
          details,
        };
        this.addLogEntry(logEntry);
        return;
      }

      // Call original console.error
      if (this.consoleEnabled) {
        originalConsoleError.apply(console, args);
      }

      // Track internally - without calling console.error again
      const id = uuidv4();
      const timestamp = new Date().toISOString();
      const logEntry: LogMessage = {
        id,
        timestamp,
        level: "error",
        message,
        details,
      };
      this.addLogEntry(logEntry);
    };

    // Override console.warn
    console.warn = (...args: unknown[]) => {
      const message = args[0]?.toString() || "Warning";
      const details = args.length > 1 ? args.slice(1) : undefined;

      // Check if this warning should be filtered
      if (this.shouldFilterError(message)) {
        // Still track internally but don't console log
        const id = uuidv4();
        const timestamp = new Date().toISOString();
        const logEntry: LogMessage = {
          id,
          timestamp,
          level: "warn",
          message,
          details,
        };
        this.addLogEntry(logEntry);
        return;
      }

      // Call original console.warn
      if (this.consoleEnabled) {
        originalConsoleWarn.apply(console, args);
      }

      // Track internally - without calling console.warn again
      const id = uuidv4();
      const timestamp = new Date().toISOString();
      const logEntry: LogMessage = {
        id,
        timestamp,
        level: "warn",
        message,
        details,
      };
      this.addLogEntry(logEntry);
    };
  }
}

// Create a singleton instance
export const logger = new Logger();

// By default, filter common React warnings in production
if (process.env.NODE_ENV === "production") {
  logger.filterReactWarnings(true);
}

/**
 * Format an error for display/logging
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
}

/**
 * Create a standardized error object with additional metadata
 */
export function createAppError(
  message: string,
  options?: {
    cause?: Error | unknown;
    code?: string;
    context?: Record<string, unknown>;
  }
): Error {
  const error = new Error(message);

  if (options?.cause) {
    (error as Error & { cause?: unknown }).cause = options.cause;
  }

  if (options?.code) {
    (error as Error & { code?: string }).code = options.code;
  }

  if (options?.context) {
    (error as Error & { context?: Record<string, unknown> }).context = options.context;
  }

  return error;
}

/**
 * Wrap an async function with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorHandler?: (error: Error) => void
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    const formattedError =
      error instanceof Error ? error : new Error(String(error));
    logger.error("Caught error in withErrorHandling", formattedError);

    if (errorHandler) {
      errorHandler(formattedError);
    }

    return undefined;
  }
}

/**
 * A hook that automatically clears the console on route changes
 * to prevent console flooding during navigation
 */
export function useClearConsoleOnNavigation() {
  const location = useLocation();

  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === "development") {
        // Only clear in development to avoid affecting production debugging
        console.clear();
      }
    };
  }, [location.pathname]);
}

/**
 * Utility to detect and report circular dependencies
 * This helps identify problematic import cycles that can cause issues
 */
export function detectCircularDependencies() {
  if (process.env.NODE_ENV === "development") {
    const loadedModules = new Set<string>();
    const moduleStack: string[] = [];

    // This is a simplistic check and would need to be expanded
    // to be more effective in a real implementation
    return function trackModule(moduleName: string) {
      if (moduleStack.includes(moduleName)) {
        console.warn(
          `[CIRCULAR DEPENDENCY] Detected cycle: ${moduleStack.join(" -> ")} -> ${moduleName}`
        );
      }

      moduleStack.push(moduleName);
      loadedModules.add(moduleName);

      return () => {
        moduleStack.pop();
      };
    };
  }

  return () => () => {};
}

/**
 * Handles cleanup for React component effects to prevent memory leaks
 * @param cleanup The cleanup function to be executed
 */
export function createSafeEffectCleanup(cleanup: () => void) {
  let isMounted = true;

  return () => {
    if (isMounted) {
      cleanup();
    }
    isMounted = false;
  };
}

/**
 * Monitor React renders to help identify components that are rendering too frequently
 * @param componentName The name of the component to monitor
 */
export function monitorRenders(componentName: string) {
  if (process.env.NODE_ENV === "development") {
    const renderCount = { count: 0 };

    return () => {
      renderCount.count++;
      if (renderCount.count > 5) {
        console.warn(
          `[PERFORMANCE] Component "${componentName}" has rendered ${renderCount.count} times`
        );
      }
    };
  }

  return () => {};
}
