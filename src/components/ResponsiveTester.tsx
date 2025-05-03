import React from "react";
import { useResponsive, useBreakpoint, BREAKPOINTS } from "@/hooks/useResponsive";

export function ResponsiveTester() {
  const {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    hasHover,
    prefersReducedMotion,
    prefersDarkMode,
    smallerThan,
    largerThan,
    between,
    isExactly,
    values
  } = useResponsive();

  // Direct breakpoint check for comparison
  const currentBreakpoint = useBreakpoint();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Responsive Hooks Tester</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Current Breakpoint</h3>
          <div className="space-y-2">
            <p className="font-mono text-lg">
              <span className="text-muted-foreground">Current breakpoint:</span>{" "}
              <span className="font-bold">{breakpoint}</span>
            </p>
            <p className="font-mono text-lg">
              <span className="text-muted-foreground">Direct hook:</span>{" "}
              <span className="font-bold">{currentBreakpoint}</span>
            </p>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Device Type</h3>
          <div className="space-y-2">
            <p>
              <span className={isMobile ? "font-bold text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                Mobile: {isMobile ? "✓" : "✗"}
              </span>
            </p>
            <p>
              <span className={isTablet ? "font-bold text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                Tablet: {isTablet ? "✓" : "✗"}
              </span>
            </p>
            <p>
              <span className={isDesktop ? "font-bold text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                Desktop: {isDesktop ? "✓" : "✗"}
              </span>
            </p>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Device Features</h3>
          <div className="space-y-2">
            <p>
              <span className={isPortrait ? "font-bold" : "text-muted-foreground"}>
                Portrait Orientation: {isPortrait ? "✓" : "✗"}
              </span>
            </p>
            <p>
              <span className={hasHover ? "font-bold" : "text-muted-foreground"}>
                Has Hover: {hasHover ? "✓" : "✗"}
              </span>
            </p>
            <p>
              <span className={prefersReducedMotion ? "font-bold" : "text-muted-foreground"}>
                Prefers Reduced Motion: {prefersReducedMotion ? "✓" : "✗"}
              </span>
            </p>
            <p>
              <span className={prefersDarkMode ? "font-bold" : "text-muted-foreground"}>
                Prefers Dark Mode: {prefersDarkMode ? "✓" : "✗"}
              </span>
            </p>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Breakpoint Comparisons</h3>
          <div className="space-y-2">
            <p>
              <span className={smallerThan("md") ? "font-bold text-blue-600 dark:text-blue-400" : "text-muted-foreground"}>
                Smaller than MD: {smallerThan("md") ? "✓" : "✗"}
              </span>
            </p>
            <p>
              <span className={largerThan("sm") ? "font-bold text-blue-600 dark:text-blue-400" : "text-muted-foreground"}>
                Larger than SM: {largerThan("sm") ? "✓" : "✗"}
              </span>
            </p>
            <p>
              <span className={between("sm", "lg") ? "font-bold text-blue-600 dark:text-blue-400" : "text-muted-foreground"}>
                Between SM and LG: {between("sm", "lg") ? "✓" : "✗"}
              </span>
            </p>
            <p>
              <span className={isExactly("md") ? "font-bold text-blue-600 dark:text-blue-400" : "text-muted-foreground"}>
                Exactly MD: {isExactly("md") ? "✓" : "✗"}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Breakpoint Values (px)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(values).map(([key, value]) => (
            <div key={key} className="p-2 bg-muted rounded text-center">
              <div className="text-xs text-muted-foreground">{key}</div>
              <div className="font-mono">{value}px</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border rounded-lg border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
        <h3 className="text-lg font-semibold mb-2">Responsive Test</h3>
        <p>
          Try resizing your browser window to see the values change in real-time.
          This component demonstrates all the capabilities of our consolidated responsive hooks.
        </p>
      </div>
    </div>
  );
} 