/**
 * Enhanced Responsive Design Hook
 * Implements Material Design breakpoint system with senior-level functionality
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

// Material Design Breakpoints (in pixels)
export const BREAKPOINTS = {
  xs: 0,      // Extra small: mobile phones
  sm: 600,    // Small: tablets in portrait mode  
  md: 840,    // Medium: tablets in landscape mode
  lg: 1024,   // Large: laptops and small desktops
  xl: 1280,   // Extra large: large desktops
  xxl: 1440   // Extra extra large: very large screens
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
export type BreakpointValue = typeof BREAKPOINTS[BreakpointKey];

export interface ResponsiveState {
  // Current breakpoint
  currentBreakpoint: BreakpointKey;
  
  // Boolean checks for breakpoints
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isXxl: boolean;
  
  // Minimum breakpoint checks (mobile-first)
  isSmUp: boolean;  // sm and larger
  isMdUp: boolean;  // md and larger
  isLgUp: boolean;  // lg and larger
  isXlUp: boolean;  // xl and larger
  isXxlUp: boolean; // xxl and larger
  
  // Maximum breakpoint checks
  isXsOnly: boolean;  // xs only
  isSmOnly: boolean;  // sm only
  isSmDown: boolean;  // sm and smaller
  isMdDown: boolean;  // md and smaller
  isLgDown: boolean;  // lg and smaller
  isXlDown: boolean;  // xl and smaller
  
  // Device type helpers
  isMobile: boolean;     // xs and sm
  isTablet: boolean;     // md
  isDesktop: boolean;    // lg and up
  isTouch: boolean;      // touch device detection
  
  // Screen dimensions
  width: number;
  height: number;
  
  // Orientation
  isPortrait: boolean;
  isLandscape: boolean;
  
  // Pixel density
  pixelRatio: number;
  isHighDensity: boolean; // > 1.5 pixel ratio
  
  // Accessibility preferences
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersDarkMode: boolean;
}

/**
 * Get the current breakpoint based on window width
 */
const getCurrentBreakpoint = (width: number): BreakpointKey => {
  if (width >= BREAKPOINTS.xxl) return 'xxl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

/**
 * Check if touch is supported
 */
const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - Legacy support
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Get media query preference
 */
const getMediaQueryPreference = (query: string): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
};

/**
 * Enhanced responsive design hook with Material Design principles
 */
export const useResponsive = (): ResponsiveState => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [preferences, setPreferences] = useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersDarkMode: false,
  });

  // Update window size
  const updateSize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Update accessibility preferences
  const updatePreferences = useCallback(() => {
    setPreferences({
      prefersReducedMotion: getMediaQueryPreference('(prefers-reduced-motion: reduce)'),
      prefersHighContrast: getMediaQueryPreference('(prefers-contrast: high)'),
      prefersDarkMode: getMediaQueryPreference('(prefers-color-scheme: dark)'),
    });
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial values
    updateSize();
    updatePreferences();

    // Throttled resize handler for better performance
    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateSize, 100);
    };

    // Media query listeners for accessibility preferences
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handlePreferenceChange = () => updatePreferences();

    // Add event listeners
    window.addEventListener('resize', throttledResize);
    window.addEventListener('orientationchange', updateSize);
    
    reducedMotionQuery.addEventListener('change', handlePreferenceChange);
    highContrastQuery.addEventListener('change', handlePreferenceChange);
    darkModeQuery.addEventListener('change', handlePreferenceChange);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('orientationchange', updateSize);
      
      reducedMotionQuery.removeEventListener('change', handlePreferenceChange);
      highContrastQuery.removeEventListener('change', handlePreferenceChange);
      darkModeQuery.removeEventListener('change', handlePreferenceChange);
    };
  }, [updateSize, updatePreferences]);

  // Memoized responsive state calculation
  const responsiveState = useMemo((): ResponsiveState => {
    const { width, height } = windowSize;
    const currentBreakpoint = getCurrentBreakpoint(width);
    
    // Calculate pixel ratio
    const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    
    return {
      currentBreakpoint,
      
      // Individual breakpoint checks
      isXs: currentBreakpoint === 'xs',
      isSm: currentBreakpoint === 'sm',
      isMd: currentBreakpoint === 'md',
      isLg: currentBreakpoint === 'lg',
      isXl: currentBreakpoint === 'xl',
      isXxl: currentBreakpoint === 'xxl',
      
      // Mobile-first breakpoint checks
      isSmUp: width >= BREAKPOINTS.sm,
      isMdUp: width >= BREAKPOINTS.md,
      isLgUp: width >= BREAKPOINTS.lg,
      isXlUp: width >= BREAKPOINTS.xl,
      isXxlUp: width >= BREAKPOINTS.xxl,
      
      // Maximum breakpoint checks
      isXsOnly: currentBreakpoint === 'xs',
      isSmOnly: currentBreakpoint === 'sm',
      isSmDown: width < BREAKPOINTS.md,
      isMdDown: width < BREAKPOINTS.lg,
      isLgDown: width < BREAKPOINTS.xl,
      isXlDown: width < BREAKPOINTS.xxl,
      
      // Device type helpers
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      isTouch: isTouchDevice(),
      
      // Screen dimensions
      width,
      height,
      
      // Orientation
      isPortrait: height > width,
      isLandscape: width > height,
      
      // Pixel density
      pixelRatio,
      isHighDensity: pixelRatio > 1.5,
      
      // Accessibility preferences
      ...preferences,
    };
  }, [windowSize, preferences]);

  return responsiveState;
};

/**
 * Hook for specific breakpoint matching
 */
export const useBreakpoint = (breakpoint: BreakpointKey): boolean => {
  const { currentBreakpoint } = useResponsive();
  return currentBreakpoint === breakpoint;
};

/**
 * Hook for minimum breakpoint matching (mobile-first)
 */
export const useBreakpointUp = (breakpoint: BreakpointKey): boolean => {
  const { width } = useResponsive();
  return width >= BREAKPOINTS[breakpoint];
};

/**
 * Hook for maximum breakpoint matching
 */
export const useBreakpointDown = (breakpoint: BreakpointKey): boolean => {
  const { width } = useResponsive();
  return width < BREAKPOINTS[breakpoint];
};

/**
 * Hook for breakpoint range matching
 */
export const useBreakpointBetween = (
  minBreakpoint: BreakpointKey, 
  maxBreakpoint: BreakpointKey
): boolean => {
  const { width } = useResponsive();
  return width >= BREAKPOINTS[minBreakpoint] && width < BREAKPOINTS[maxBreakpoint];
};

/**
 * Hook for device type detection
 */
export const useDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const { isMobile, isTablet } = useResponsive();
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

/**
 * Hook for responsive values based on breakpoints
 * Usage: const fontSize = useResponsiveValue({ xs: '14px', md: '16px', lg: '18px' })
 */
export const useResponsiveValue = <T>(values: Partial<Record<BreakpointKey, T>>): T | undefined => {
  const { currentBreakpoint } = useResponsive();
  
  // Find the appropriate value by checking from current breakpoint down
  const breakpointOrder: BreakpointKey[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return undefined;
};

/**
 * CSS class utility for responsive design
 */
export const getResponsiveClasses = (
  baseClasses: string,
  responsiveClasses: Partial<Record<BreakpointKey, string>>
): string => {
  const { currentBreakpoint } = useResponsive();
  const breakpointOrder: BreakpointKey[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  let classes = baseClasses;
  
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (responsiveClasses[bp]) {
      classes += ` ${responsiveClasses[bp]}`;
      break;
    }
  }
  
  return classes;
};

export default useResponsive; 