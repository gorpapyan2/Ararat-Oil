import React, { useEffect, useState } from 'react';

/**
 * Performance measurement constants
 */
export const PERFORMANCE_MARKS = {
  APP_INIT: 'app-init',
  APP_RENDERED: 'app-rendered',
  ROUTE_CHANGE_START: 'route-change-start',
  ROUTE_CHANGE_COMPLETE: 'route-change-complete',
  COMPONENT_RENDER_START: 'component-render-start',
  COMPONENT_RENDER_COMPLETE: 'component-render-complete',
};

/**
 * Creates a performance mark
 */
export function markPerformance(name: string, detail?: Record<string, unknown>) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name, { detail });
  }
}

/**
 * Measures time between two performance marks
 */
export function measurePerformance(startMark: string, endMark: string, name: string) {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const measurements = performance.getEntriesByName(name, 'measure');
      const latestMeasurement = measurements[measurements.length - 1];
      return latestMeasurement?.duration || 0;
    } catch (e) {
      console.warn('Error measuring performance:', e);
      return 0;
    }
  }
  return 0;
}

/**
 * Hook for measuring component render performance
 */
export function useComponentPerformance(componentName: string) {
  const [renderTime, setRenderTime] = useState<number | null>(null);
  
  useEffect(() => {
    const renderStart = `${PERFORMANCE_MARKS.COMPONENT_RENDER_START}-${componentName}`;
    const renderComplete = `${PERFORMANCE_MARKS.COMPONENT_RENDER_COMPLETE}-${componentName}`;
    
    // Mark render start
    markPerformance(renderStart);
    
    return () => {
      // Mark render complete on cleanup
      markPerformance(renderComplete);
      const duration = measurePerformance(
        renderStart, 
        renderComplete, 
        `${componentName}-render-duration`
      );
      setRenderTime(duration);
      
      // Log slow renders in development
      if (duration > 50 && import.meta.env.DEV) {
        console.warn(`🐢 Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
  
  return renderTime;
}

/**
 * HOC to wrap components with performance tracking
 */
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  options: { name?: string; threshold?: number } = {}
) {
  const displayName = options.name || Component.displayName || Component.name || 'UnknownComponent';
  const threshold = options.threshold || 50; // Default threshold: 50ms
  
  function PerformanceTrackedComponent(props: P) {
    useComponentPerformance(displayName);
    
    return <Component {...props} />;
  }
  
  PerformanceTrackedComponent.displayName = `WithPerformance(${displayName})`;
  return PerformanceTrackedComponent;
}

/**
 * Keeps track of component render counts in development
 */
export function useRenderCount(componentName: string) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (import.meta.env.DEV) {
      setCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount > 5) {
          console.warn(`🔄 Excessive renders: ${componentName} has rendered ${newCount} times`);
        }
        return newCount;
      });
    }
  }, [componentName]);
  
  return count;
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  // Mark application initialization
  markPerformance(PERFORMANCE_MARKS.APP_INIT);
  
  // Add event listeners for route changes if using React Router
  window.addEventListener('popstate', () => {
    markPerformance(PERFORMANCE_MARKS.ROUTE_CHANGE_START);
  });
  
  // Log all web vitals
  if ('web-vitals' in window) {
    import('web-vitals').then(({ onCLS, onFID, onLCP }) => {
      onCLS(metric => console.log('CLS:', metric.value));
      onFID(metric => console.log('FID:', metric.value));
      onLCP(metric => console.log('LCP:', metric.value));
    });
  }
  
  // Log when the app is fully rendered
  window.addEventListener('load', () => {
    markPerformance(PERFORMANCE_MARKS.APP_RENDERED);
    const appStartTime = measurePerformance(
      PERFORMANCE_MARKS.APP_INIT,
      PERFORMANCE_MARKS.APP_RENDERED,
      'app-total-init-time'
    );
    console.log(`🚀 App initialized in ${appStartTime.toFixed(2)}ms`);
  });
} 