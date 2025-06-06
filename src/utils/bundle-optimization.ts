/**
 * Bundle Optimization Utilities
 * 
 * This module provides utilities for optimizing bundle size through:
 * - Component lazy loading
 * - Dynamic imports
 * - Preloading strategies
 * - Bundle analysis helpers
 */

import React, { lazy, ComponentType } from 'react';

// Types
export interface LazyComponentOptions {
  preload?: boolean;
  errorBoundary?: boolean;
  fallback?: ComponentType;
}

export interface DynamicImportOptions {
  timeout?: number;
  retries?: number;
}

export interface BundleChunk {
  name: string;
  size?: number;
  dependencies: string[];
}

// Extend Performance interface to include memory property
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
    };
  }
}

// Lazy loading wrapper with error handling and preloading
export const createLazyComponent = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
) => {
  const LazyComponent = lazy(factory);
  
  // Preload if requested
  if (options.preload) {
    // Preload after a short delay to not block initial render
    setTimeout(() => {
      factory().catch(() => {
        // Silently fail preloading
      });
    }, 100);
  }
  
  return LazyComponent;
};

// Dynamic import with retry logic
export const dynamicImport = async <T>(
  importPromise: () => Promise<T>,
  options: DynamicImportOptions = {}
): Promise<T> => {
  const { timeout = 10000, retries = 2 } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await Promise.race([
        importPromise(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Import timeout')), timeout)
        ),
      ]);
      
      return result;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < retries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError!;
};

// Preload resources for better user experience
export const preloadResource = (url: string, as: 'script' | 'style' | 'font' | 'image' = 'script') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
};

// Bundle chunk registry for tracking loaded modules
class BundleChunkRegistry {
  private loadedChunks = new Set<string>();
  private chunkMap = new Map<string, BundleChunk>();
  
  register(chunk: BundleChunk) {
    this.chunkMap.set(chunk.name, chunk);
  }
  
  markLoaded(chunkName: string) {
    this.loadedChunks.add(chunkName);
  }
  
  isLoaded(chunkName: string): boolean {
    return this.loadedChunks.has(chunkName);
  }
  
  getLoadedChunks(): string[] {
    return Array.from(this.loadedChunks);
  }
  
  getChunkInfo(chunkName: string): BundleChunk | undefined {
    return this.chunkMap.get(chunkName);
  }
  
  // Get chunks that could be preloaded based on current route
  getPreloadableChunks(currentRoute: string): string[] {
    const preloadable: string[] = [];
    
    // Define route relationships for intelligent preloading
    const routeRelations: Record<string, string[]> = {
      '/dashboard': ['finance', 'fuel-management', 'sales'],
      '/finance': ['finance-expenses', 'finance-revenue', 'finance-transactions'],
      '/fuel-management': ['fuel-supplies', 'fuel-sales', 'tanks'],
      '/sales': ['sales-new', 'sales-history'],
      '/management': ['employees', 'shifts'],
    };
    
    const related = routeRelations[currentRoute] || [];
    
    for (const chunkName of related) {
      if (!this.isLoaded(chunkName)) {
        preloadable.push(chunkName);
      }
    }
    
    return preloadable;
  }
}

export const bundleRegistry = new BundleChunkRegistry();

// Performance monitoring for bundle loading
export class BundlePerformanceMonitor {
  private loadTimes = new Map<string, number>();
  private errors = new Map<string, Error[]>();
  
  startTiming(chunkName: string) {
    this.loadTimes.set(`${chunkName}_start`, performance.now());
  }
  
  endTiming(chunkName: string) {
    const startTime = this.loadTimes.get(`${chunkName}_start`);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.loadTimes.set(chunkName, duration);
      bundleRegistry.markLoaded(chunkName);
      
      // Log slow loading chunks
      if (duration > 2000) {
        console.warn(`Slow chunk loading detected: ${chunkName} took ${duration}ms`);
      }
    }
  }
  
  recordError(chunkName: string, error: Error) {
    const errors = this.errors.get(chunkName) || [];
    errors.push(error);
    this.errors.set(chunkName, errors);
  }
  
  getMetrics() {
    const metrics = {
      loadTimes: Object.fromEntries(
        Array.from(this.loadTimes.entries()).filter(([key]) => !key.endsWith('_start'))
      ),
      errors: Object.fromEntries(this.errors.entries()),
      totalChunks: this.loadTimes.size / 2, // Each chunk has start and end timing
      averageLoadTime: 0,
    };
    
    const times = Object.values(metrics.loadTimes);
    if (times.length > 0) {
      metrics.averageLoadTime = times.reduce((a, b) => a + b, 0) / times.length;
    }
    
    return metrics;
  }
  
  // Generate optimization report
  generateReport() {
    const metrics = this.getMetrics();
    
    console.group('📊 Bundle Performance Report');
    console.log(`Total Chunks Loaded: ${metrics.totalChunks}`);
    console.log(`Average Load Time: ${metrics.averageLoadTime.toFixed(2)}ms`);
    
    // Highlight problematic chunks
    const slowChunks = Object.entries(metrics.loadTimes)
      .filter(([_, time]) => time > 1000)
      .sort(([_, a], [__, b]) => b - a);
    
    if (slowChunks.length > 0) {
      console.warn('Slow Loading Chunks:');
      slowChunks.forEach(([chunk, time]) => {
        console.warn(`• ${chunk}: ${time.toFixed(2)}ms`);
      });
    }
    
    // Show error summary
    const errorCount = Object.values(metrics.errors).reduce((total, errors) => total + errors.length, 0);
    if (errorCount > 0) {
      console.error(`Total Loading Errors: ${errorCount}`);
      Object.entries(metrics.errors).forEach(([chunk, errors]) => {
        console.error(`• ${chunk}: ${errors.length} errors`);
      });
    }
    
    console.groupEnd();
    
    return metrics;
  }
}

export const performanceMonitor = new BundlePerformanceMonitor();

// Higher-order component for monitoring component loading
export const withLoadingMonitor = <P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>,
  chunkName: string
): React.ComponentType<P> => {
  const MonitoredComponent = (props: P) => {
    React.useEffect(() => {
      performanceMonitor.endTiming(chunkName);
    }, []);
    
    return React.createElement(WrappedComponent, props);
  };
  
  MonitoredComponent.displayName = `withLoadingMonitor(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return MonitoredComponent;
};

// Utility to measure bundle impact
export const measureBundleImpact = async (name: string, action: () => Promise<void>) => {
  const startSize = performance.memory?.usedJSHeapSize || 0;
  const startTime = performance.now();
  
  try {
    await action();
  } finally {
    const endTime = performance.now();
    const endSize = performance.memory?.usedJSHeapSize || 0;
    
    console.log(`Bundle Impact - ${name}:`, {
      duration: `${(endTime - startTime).toFixed(2)}ms`,
      memoryDelta: `${((endSize - startSize) / 1024 / 1024).toFixed(2)}MB`,
    });
  }
};

// Code splitting helpers for specific features
export const createFeatureLazyLoader = (featureName: string) => {
  return {
    // Load feature pages
    loadPage: (pageName: string) => createLazyComponent(
      () => dynamicImport(() => import(`@/features/${featureName}/pages/${pageName}Page.tsx`)),
      { preload: false }
    ),
    
    // Load feature components  
    loadComponent: (componentName: string) => createLazyComponent(
      () => dynamicImport(() => import(`@/features/${featureName}/components/${componentName}.tsx`)),
      { preload: false }
    ),
    
    // Preload entire feature
    preloadFeature: async () => {
      performanceMonitor.startTiming(featureName);
      
      try {
        await Promise.all([
          dynamicImport(() => import(`@/features/${featureName}/index.ts`)),
        ]);
      } catch (error) {
        performanceMonitor.recordError(featureName, error as Error);
        throw error;
      }
    },
  };
};

// Icon optimization utilities
export const optimizeIconImports = () => {
  // This would be implemented as a build-time optimization
  // For runtime, we can provide a utility to dynamically load icons
  return {
    loadIcon: async (iconName: string) => {
      try {
        const iconModule = await dynamicImport(() => import(`lucide-react/${iconName}.js`));
        return iconModule.default;
      } catch {
        // Fallback to our centralized icon system
        const { getIconByName } = await import('@/shared/components/ui/icons');
        return getIconByName(iconName);
      }
    },
  };
};

export default {
  createLazyComponent,
  dynamicImport,
  preloadResource,
  bundleRegistry,
  performanceMonitor,
  withLoadingMonitor,
  measureBundleImpact,
  createFeatureLazyLoader,
  optimizeIconImports,
}; 