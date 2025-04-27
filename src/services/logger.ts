import * as Sentry from '@sentry/react';

// Initialize Sentry (should be called in main.tsx)
export const initSentry = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Only initialize in production by default, or if explicitly enabled in dev
  if (!isDevelopment || import.meta.env.VITE_ENABLE_SENTRY_IN_DEV === 'true') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || '',
      integrations: [],
      
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
      
      // Only capture errors in production unless explicitly enabled in dev
      enabled: !isDevelopment || import.meta.env.VITE_ENABLE_SENTRY_IN_DEV === 'true',
      
      // Capture source maps for better error reporting
      release: import.meta.env.VITE_APP_VERSION || '0.0.0',
      
      // Don't send users IP address
      sendDefaultPii: false,
      
      // Only send errors to Sentry if they are actual errors
      beforeSend(event) {
        // Don't send events for network issues in development
        if (isDevelopment && event.exception?.values?.some(e => 
          e.type === 'NetworkError' || 
          e.value?.includes('Network') || 
          e.value?.includes('Failed to fetch')
        )) {
          return null;
        }
        return event;
      },
    });
  }
};

// Helper functions to standardize logging
export const logger = {
  // Information logging
  info: (message: string, extraData?: Record<string, any>) => {
    console.info(`[INFO] ${message}`, extraData);
    Sentry.addBreadcrumb({
      category: 'info',
      message,
      level: 'info',
      data: extraData,
    });
  },
  
  // Warning logging
  warn: (message: string, extraData?: Record<string, any>) => {
    console.warn(`[WARN] ${message}`, extraData);
    Sentry.addBreadcrumb({
      category: 'warning',
      message,
      level: 'warning',
      data: extraData,
    });
  },
  
  // Error logging
  error: (error: Error | string, extraData?: Record<string, any>) => {
    const isErrorObject = error instanceof Error;
    const errorMessage = isErrorObject ? error.message : error;
    
    console.error(`[ERROR] ${errorMessage}`, isErrorObject ? error : '', extraData);
    
    if (isErrorObject) {
      Sentry.captureException(error, {
        extra: extraData,
      });
    } else {
      Sentry.captureMessage(error, {
        level: 'error',
        extra: extraData,
      });
    }
  },
  
  // Track user actions
  trackAction: (action: string, extraData?: Record<string, any>) => {
    console.debug(`[ACTION] ${action}`, extraData);
    Sentry.addBreadcrumb({
      category: 'action',
      message: action,
      level: 'info',
      data: extraData,
    });
  },
  
  // Set user context for better error tracking
  setUser: (user: { id: string; email?: string; username?: string }) => {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  },
  
  // Clear user context on logout
  clearUser: () => {
    Sentry.setUser(null);
  },
  
  // Set extra context for better error tracking
  setContext: (name: string, context: Record<string, any>) => {
    Sentry.setContext(name, context);
  },
};

export default logger;
