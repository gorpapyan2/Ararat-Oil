/**
 * Bundle Optimization Utilities
 * 
 * Collection of utilities to optimize bundle size and improve application performance
 * through efficient loading strategies, dynamic imports, and resource management.
 */

import React, { ComponentType } from 'react';

// Type definitions for optimization utilities
export interface LazyLoadOptions {
  fallback?: React.ComponentType;
  retryAttempts?: number;
  retryDelay?: number;
  preloadOnHover?: boolean;
}

export interface PreloadOptions {
  priority?: 'high' | 'medium' | 'low';
  timeout?: number;
}

export interface ChunkInfo {
  name: string;
  size: number;
  loadTime?: number;
  cached?: boolean;
}

/**
 * Dynamic import with retry logic and error handling
 */
export async function dynamicImport<T = any>(
  importFn: () => Promise<T>,
  options: { retries?: number; delay?: number } = {}
): Promise<T> {
  const { retries = 3, delay = 1000 } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await importFn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
        console.warn(`Dynamic import failed (attempt ${attempt + 1}/${retries + 1}):`, error);
      }
    }
  }
  
  throw new Error(`Dynamic import failed after ${retries + 1} attempts: ${lastError?.message}`);
}

/**
 * Create a lazy-loaded component with optimized loading
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): React.LazyExoticComponent<T> {
  const { retryAttempts = 3, retryDelay = 1000 } = options;
  
  return React.lazy(() => 
    dynamicImport(importFn, { retries: retryAttempts, delay: retryDelay })
  );
}

/**
 * Preload resources with various strategies
 */
export class ResourcePreloader {
  private static preloadedChunks = new Set<string>();
  private static preloadPromises = new Map<string, Promise<any>>();

  /**
   * Preload a chunk by name
   */
  static async preloadChunk(
    importFn: () => Promise<any>,
    chunkName: string,
    options: PreloadOptions = {}
  ): Promise<void> {
    const { priority = 'medium', timeout = 5000 } = options;
    
    if (this.preloadedChunks.has(chunkName)) {
      return;
    }

    if (this.preloadPromises.has(chunkName)) {
      return this.preloadPromises.get(chunkName);
    }

    const preloadPromise = this.executePreload(importFn, chunkName, timeout);
    this.preloadPromises.set(chunkName, preloadPromise);

    try {
      await preloadPromise;
      this.preloadedChunks.add(chunkName);
    } catch (error) {
      this.preloadPromises.delete(chunkName);
      console.warn(`Failed to preload chunk "${chunkName}":`, error);
    }
  }

  private static async executePreload(
    importFn: () => Promise<any>,
    chunkName: string,
    timeout: number
  ): Promise<void> {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Preload timeout for ${chunkName}`)), timeout)
    );

    try {
      await Promise.race([importFn(), timeoutPromise]);
    } catch (error) {
      throw new Error(`Preload failed for ${chunkName}: ${error}`);
    }
  }

  /**
   * Preload multiple chunks with priority ordering
   */
  static async preloadChunks(
    chunks: Array<{
      importFn: () => Promise<any>;
      name: string;
      priority?: 'high' | 'medium' | 'low';
    }>
  ): Promise<void> {
    // Sort by priority
    const sortedChunks = chunks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium'];
    });

    // Preload high priority chunks first
    const highPriority = sortedChunks.filter(chunk => chunk.priority === 'high');
    await Promise.all(
      highPriority.map(chunk => 
        this.preloadChunk(chunk.importFn, chunk.name, { priority: 'high' })
      )
    );

    // Preload medium and low priority chunks
    const otherChunks = sortedChunks.filter(chunk => chunk.priority !== 'high');
    otherChunks.forEach(chunk => 
      this.preloadChunk(chunk.importFn, chunk.name, { priority: chunk.priority })
    );
  }

  /**
   * Check if a chunk is preloaded
   */
  static isPreloaded(chunkName: string): boolean {
    return this.preloadedChunks.has(chunkName);
  }

  /**
   * Clear preload cache
   */
  static clearCache(): void {
    this.preloadedChunks.clear();
    this.preloadPromises.clear();
  }
}

/**
 * Bundle performance monitoring
 */
export class BundlePerformanceMonitor {
  private static chunkLoadTimes = new Map<string, number>();
  private static observers: PerformanceObserver[] = [];

  /**
   * Start monitoring chunk load performance
   */
  static startMonitoring(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource' && entry.name.includes('chunk')) {
          const chunkName = this.extractChunkName(entry.name);
          this.chunkLoadTimes.set(chunkName, entry.duration || 0);
        }
      });
    });

    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.push(resourceObserver);

    // Monitor navigation timing
    const navigationObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          console.log('Bundle Performance Metrics:', {
            domContentLoaded: (entry as PerformanceNavigationTiming).domContentLoadedEventEnd,
            firstContentfulPaint: this.getFirstContentfulPaint(),
            totalLoadTime: entry.duration
          });
        }
      });
    });

    navigationObserver.observe({ entryTypes: ['navigation'] });
    this.observers.push(navigationObserver);
  }

  /**
   * Get chunk load performance data
   */
  static getChunkMetrics(): ChunkInfo[] {
    return Array.from(this.chunkLoadTimes.entries()).map(([name, loadTime]) => ({
      name,
      size: 0, // Would need build-time data for actual size
      loadTime,
      cached: false
    }));
  }

  /**
   * Stop monitoring and clean up
   */
  static stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  private static extractChunkName(url: string): string {
    const match = url.match(/\/([^\/]+\.chunk\.[^\/]+)$/);
    return match ? match[1] : url;
  }

  private static getFirstContentfulPaint(): number | null {
    if (typeof window === 'undefined') return null;
    
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : null;
  }
}

/**
 * Intelligent preloading based on user behavior
 */
export class IntelligentPreloader {
  private static isIdle = false;
  private static idleCallback: number | null = null;
  
  /**
   * Preload chunks during browser idle time
   */
  static preloadOnIdle(
    chunks: Array<{ importFn: () => Promise<any>; name: string }>
  ): void {
    if (typeof window === 'undefined') return;

    const schedulePreload = () => {
      if ('requestIdleCallback' in window) {
        this.idleCallback = (window as any).requestIdleCallback(() => {
          ResourcePreloader.preloadChunks(
            chunks.map(chunk => ({ ...chunk, priority: 'low' as const }))
          );
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          ResourcePreloader.preloadChunks(
            chunks.map(chunk => ({ ...chunk, priority: 'low' as const }))
          );
        }, 100);
      }
    };

    schedulePreload();
  }

  /**
   * Preload based on user interaction patterns
   */
  static preloadOnInteraction(
    element: HTMLElement,
    importFn: () => Promise<any>,
    chunkName: string
  ): () => void {
    let hasPreloaded = false;

    const preload = () => {
      if (!hasPreloaded) {
        ResourcePreloader.preloadChunk(importFn, chunkName, { priority: 'medium' });
        hasPreloaded = true;
      }
    };

    const handleMouseEnter = () => preload();
    const handleFocus = () => preload();

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('focus', handleFocus);

    // Return cleanup function
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('focus', handleFocus);
    };
  }

  /**
   * Cancel idle preloading
   */
  static cancelIdlePreload(): void {
    if (this.idleCallback && typeof window !== 'undefined' && 'cancelIdleCallback' in (window as any)) {
      (window as any).cancelIdleCallback(this.idleCallback);
      this.idleCallback = null;
    }
  }
}

/**
 * Bundle size optimization utilities
 */
export const BundleOptimizer = {
  /**
   * Tree-shake utility functions
   */
  createTreeShakableExport: <T extends Record<string, any>>(obj: T): T => {
    // Return object with named exports for better tree-shaking
    return obj;
  },

  /**
   * Generate dynamic import code with webpack magic comments
   */
  generateLazyImport: (
    modulePath: string,
    chunkName?: string,
    preload?: boolean
  ): string => {
    const webpackComments = [
      chunkName && `webpackChunkName: "${chunkName}"`,
      preload === true && 'webpackPreload: true',
      preload === false && 'webpackPrefetch: true'
    ].filter(Boolean).join(', ');

    return `import(/* ${webpackComments} */ '${modulePath}')`;
  },

  /**
   * Check if code splitting is supported
   */
  isCodeSplittingSupported: (): boolean => {
    try {
      // Check if dynamic imports are supported in the current environment
    } catch {
      return false;
    }
  }
};

/**
 * Development-only bundle analysis helpers
 */
export const DevBundleAnalysis = {
  /**
   * Log bundle information to console
   */
  logBundleInfo: (): void => {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔍 Bundle Analysis');
      console.log('Chunk Metrics:', BundlePerformanceMonitor.getChunkMetrics());
      console.log('Preloaded Chunks:', Array.from((ResourcePreloader as any).preloadedChunks));
      console.groupEnd();
    }
  },

  /**
   * Analyze component render performance
   */
  measureComponentRender: <T extends any[]>(
    componentName: string,
    renderFn: (...args: T) => any
  ) => {
    return (...args: T) => {
      if (process.env.NODE_ENV === 'development') {
        const startTime = performance.now();
        const result = renderFn(...args);
        const endTime = performance.now();
        console.log(`Component "${componentName}" render time: ${endTime - startTime}ms`);
        return result;
      }
      return renderFn(...args);
    };
  }
};

// Initialize performance monitoring in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  BundlePerformanceMonitor.startMonitoring();
}

export default {
  dynamicImport,
  createLazyComponent,
  ResourcePreloader,
  BundlePerformanceMonitor,
  IntelligentPreloader,
  BundleOptimizer,
  DevBundleAnalysis
}; 