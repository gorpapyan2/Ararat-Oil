import { useEffect, useState } from "react";

/**
 * Breakpoint constants - consistent with Tailwind defaults
 */
export const BREAKPOINTS = {
  XS: 480, // Extra small screens
  SM: 640, // Small screens (mobile)
  MD: 768, // Medium screens (tablet)
  LG: 1024, // Large screens (desktop)
  XL: 1280, // Extra large screens
  XXL: 1536, // 2x extra large screens
};

/**
 * Available breakpoint names
 */
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

/**
 * Core media query hook - returns true if the query matches
 *
 * @param query CSS media query string
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // SSR safety check
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern event listener
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Hook to detect if the viewport is mobile-sized
 *
 * @returns boolean indicating if the screen is mobile-sized
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.MD - 1}px)`);
}

/**
 * Hook to detect if the viewport is tablet-sized
 *
 * @returns boolean indicating if the screen is tablet-sized
 */
export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`
  );
}

/**
 * Hook to detect if the viewport is desktop-sized or larger
 *
 * @returns boolean indicating if the screen is desktop-sized or larger
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.LG}px)`);
}

/**
 * Hook that returns the current breakpoint name
 *
 * @returns Current breakpoint name as a string
 */
export function useBreakpoint(): Breakpoint {
  // Default for SSR
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("lg");

  const isXS = useMediaQuery(`(max-width: ${BREAKPOINTS.SM - 1}px)`);
  const isSM = useMediaQuery(
    `(min-width: ${BREAKPOINTS.SM}px) and (max-width: ${BREAKPOINTS.MD - 1}px)`
  );
  const isMD = useMediaQuery(
    `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`
  );
  const isLG = useMediaQuery(
    `(min-width: ${BREAKPOINTS.LG}px) and (max-width: ${BREAKPOINTS.XL - 1}px)`
  );
  const isXL = useMediaQuery(
    `(min-width: ${BREAKPOINTS.XL}px) and (max-width: ${BREAKPOINTS.XXL - 1}px)`
  );
  const isXXL = useMediaQuery(`(min-width: ${BREAKPOINTS.XXL}px)`);

  useEffect(() => {
    if (isXS) setBreakpoint("xs");
    else if (isSM) setBreakpoint("sm");
    else if (isMD) setBreakpoint("md");
    else if (isLG) setBreakpoint("lg");
    else if (isXL) setBreakpoint("xl");
    else if (isXXL) setBreakpoint("xxl");
  }, [isXS, isSM, isMD, isLG, isXL, isXXL]);

  return breakpoint;
}

/**
 * Hook to detect if orientation is portrait
 *
 * @returns boolean indicating if the orientation is portrait
 */
export function useIsPortrait(): boolean {
  return useMediaQuery("(orientation: portrait)");
}

/**
 * Hook to detect if the device has hover capability
 * Useful for handling touch vs. mouse interactions
 *
 * @returns boolean indicating if the device has hover capability
 */
export function useHasHover(): boolean {
  return useMediaQuery("(hover: hover)");
}

/**
 * Hook to detect if the user has requested reduced motion
 * Important for accessibility
 *
 * @returns boolean indicating if the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/**
 * Hook to detect if the user prefers dark color scheme
 *
 * @returns boolean indicating if the user prefers dark mode
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

/**
 * Comprehensive responsive hook that provides all responsive utilities
 *
 * @returns Object with all responsive utilities
 */
export function useResponsive() {
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isPortrait = useIsPortrait();
  const hasHover = useHasHover();
  const prefersReducedMotion = usePrefersReducedMotion();
  const prefersDarkMode = usePrefersDarkMode();

  // Breakpoint values for comparison
  const breakpointValues: Record<Breakpoint, number> = {
    xs: 0,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 5,
  };

  return {
    // Current state
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    hasHover,
    prefersReducedMotion,
    prefersDarkMode,

    // Responsive helpers
    smallerThan: (bp: Breakpoint) => {
      return breakpointValues[breakpoint] < breakpointValues[bp];
    },
    largerThan: (bp: Breakpoint) => {
      return breakpointValues[breakpoint] > breakpointValues[bp];
    },
    between: (minBp: Breakpoint, maxBp: Breakpoint) => {
      return (
        breakpointValues[breakpoint] >= breakpointValues[minBp] &&
        breakpointValues[breakpoint] <= breakpointValues[maxBp]
      );
    },

    // Exact breakpoint checks
    isExactly: (bp: Breakpoint) => breakpoint === bp,

    // Breakpoint values for reference
    values: BREAKPOINTS,
  };
}
