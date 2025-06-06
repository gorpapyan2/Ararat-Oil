import React, { Suspense, ComponentType, ReactElement } from 'react';
import { StatusIcons } from '@/shared/components/ui/icons';

interface LazyLoaderProps {
  children: ReactElement;
  fallback?: ReactElement;
  error?: ReactElement;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: ReactElement },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: ReactElement }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyLoader Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const DefaultLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px] w-full">
    <div className="flex flex-col items-center gap-3">
      <StatusIcons.Loading className="w-8 h-8 animate-spin text-accent" />
      <p className="text-sm text-muted-foreground">Loading component...</p>
    </div>
  </div>
);

const DefaultErrorFallback = ({ error }: { error?: Error }) => (
  <div className="flex items-center justify-center min-h-[200px] w-full">
    <div className="flex flex-col items-center gap-3 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
      <StatusIcons.Error className="w-8 h-8 text-destructive" />
      <div className="text-center">
        <p className="text-sm font-medium text-destructive mb-1">Failed to load component</p>
        <p className="text-xs text-muted-foreground">
          {error?.message || 'An unexpected error occurred'}
        </p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-3 py-1.5 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
      >
        Reload Page
      </button>
    </div>
  </div>
);

/**
 * LazyLoader Component
 * 
 * Provides a wrapper for lazy-loaded components with proper loading states,
 * error boundaries, and fallback components for optimal UX during code splitting.
 */
export const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback = <DefaultLoadingFallback />,
  error 
}) => {
  return (
    <ErrorBoundary fallback={error}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

/**
 * Higher-order function to create lazy-loaded components with built-in loading states
 */
export function withLazyLoading<T extends Record<string, any>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options?: {
    fallback?: ReactElement;
    error?: ReactElement;
    displayName?: string;
  }
) {
  const LazyComponent = React.lazy(importFn);
  
  const WrappedComponent: React.FC<T> = (props: T) => (
    <LazyLoader 
      fallback={options?.fallback}
      error={options?.error}
    >
      <LazyComponent {...(props as any)} />
    </LazyLoader>
  );

  WrappedComponent.displayName = options?.displayName || 'LazyLoadedComponent';
  
  return WrappedComponent;
}

/**
 * Utility function to preload a lazy component
 */
export function preloadComponent(importFn: () => Promise<any>) {
  importFn().catch(console.error);
}

/**
 * Hook to preload components on user interaction (hover, focus, etc.)
 */
export function usePreloadOnInteraction(importFn: () => Promise<any>) {
  const [isPreloaded, setIsPreloaded] = React.useState(false);

  const preload = React.useCallback(() => {
    if (!isPreloaded) {
      preloadComponent(importFn);
      setIsPreloaded(true);
    }
  }, [importFn, isPreloaded]);

  return {
    onMouseEnter: preload,
    onFocus: preload,
    isPreloaded
  };
}

export default LazyLoader; 