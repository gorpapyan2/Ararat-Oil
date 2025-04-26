import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * useIsMobile - React hook to detect if the viewport is mobile-sized.
 * - Uses window resize event for compatibility.
 * - SSR safe (returns false on server).
 * - Returns a boolean.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
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
