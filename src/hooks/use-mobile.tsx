import * as React from "react";

// Breakpoint constants
export const BREAKPOINTS = {
  MOBILE: 640, // sm
  TABLET: 768, // md
  DESKTOP: 1024, // lg
  LARGE: 1280, // xl
  XLARGE: 1536, // 2xl
};

/**
 * useIsMobile - React hook to detect if the viewport is mobile-sized.
 * - Uses window resize event for compatibility.
 * - SSR safe (returns false on server).
 * - Returns a boolean.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < BREAKPOINTS.TABLET;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.TABLET);
    };

    window.addEventListener("resize", handleResize);
    // Set initial value in case of hydration mismatch
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}

/**
 * useBreakpoint - React hook to detect current breakpoint
 * - Returns 'mobile', 'tablet', 'desktop', 'large', or 'xlarge'
 */
export function useBreakpoint():
  | "mobile"
  | "tablet"
  | "desktop"
  | "large"
  | "xlarge" {
  const [breakpoint, setBreakpoint] = React.useState<
    "mobile" | "tablet" | "desktop" | "large" | "xlarge"
  >(() => {
    if (typeof window === "undefined") return "desktop"; // SSR default

    const width = window.innerWidth;
    if (width < BREAKPOINTS.MOBILE) return "mobile";
    if (width < BREAKPOINTS.TABLET) return "tablet";
    if (width < BREAKPOINTS.DESKTOP) return "desktop";
    if (width < BREAKPOINTS.LARGE) return "large";
    return "xlarge";
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.MOBILE) setBreakpoint("mobile");
      else if (width < BREAKPOINTS.TABLET) setBreakpoint("tablet");
      else if (width < BREAKPOINTS.DESKTOP) setBreakpoint("desktop");
      else if (width < BREAKPOINTS.LARGE) setBreakpoint("large");
      else setBreakpoint("xlarge");
    };

    window.addEventListener("resize", handleResize);
    // Set initial value
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return breakpoint;
}
