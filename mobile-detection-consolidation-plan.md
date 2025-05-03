# Mobile Detection Hooks Consolidation Plan

## Background

The codebase currently has multiple implementations for responsive design detection:
1. `src/hooks/use-mobile.tsx` - Has specific hooks for mobile detection and breakpoint detection
2. `src/hooks/use-media-query.ts` - A more generic media query hook

These duplications were also mentioned in `TODO.ui-ux-accessibility.md` as needing consolidation.

## Consolidation Strategy

### 1. Choose the Primary Implementation

We'll create a consolidated implementation that:
- Uses `use-media-query.ts` as the core building block (since it's more flexible)
- Provides the same functionality currently in `use-mobile.tsx`
- Follows modern React patterns with TypeScript
- Is SSR-safe
- Uses proper naming conventions

### 2. Migration Steps

1. **Component Audit**: 
   - Identify all components using either hook
   - Document which components use which implementation

2. **Create Consolidated Implementation**:
   - Create a new file `src/hooks/useResponsive.ts` that combines both approaches
   - Ensure it has proper TypeScript types and SSR safety

3. **Update Components**:
   - Migrate components to use the new consolidated hook
   - Test each component to ensure responsive behavior works correctly

4. **Remove Deprecated Files**:
   - Remove `src/hooks/use-mobile.tsx` once all components are migrated
   - Keep `src/hooks/use-media-query.ts` as a utility but update import paths

### 3. Implementation Details

```typescript
// src/hooks/useResponsive.ts
import { useEffect, useState } from "react";
import { useMediaQuery } from "./use-media-query";

// Breakpoint constants - consistent with Tailwind defaults
export const BREAKPOINTS = {
  SM: 640,  // Small (mobile)
  MD: 768,  // Medium (tablet)
  LG: 1024, // Large (desktop)
  XL: 1280, // Extra Large
  XXL: 1536, // 2X Extra Large
};

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

/**
 * Hook to detect if the viewport is mobile-sized.
 * Uses media queries and is SSR safe.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.MD - 1}px)`);
}

/**
 * Hook to detect if the viewport is tablet-sized.
 */
export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`
  );
}

/**
 * Hook to detect if the viewport is desktop-sized or larger.
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.LG}px)`);
}

/**
 * Hook that returns the current breakpoint name
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
 */
export function useIsPortrait(): boolean {
  return useMediaQuery("(orientation: portrait)");
}

/**
 * Hook to detect if the device has hover capability
 * Useful for handling touch vs. mouse interactions
 */
export function useHasHover(): boolean {
  return useMediaQuery("(hover: hover)");
}

/**
 * All responsive utilities in a single hook
 */
export function useResponsive() {
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const isPortrait = useIsPortrait();
  const hasHover = useHasHover();

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    hasHover,
    // Helper functions
    smallerThan: (bp: Breakpoint) => {
      const breakpoints: Record<Breakpoint, number> = {
        xs: 0,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
        xxl: 5
      };
      return breakpoints[breakpoint] < breakpoints[bp];
    },
    largerThan: (bp: Breakpoint) => {
      const breakpoints: Record<Breakpoint, number> = {
        xs: 0,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
        xxl: 5
      };
      return breakpoints[breakpoint] > breakpoints[bp];
    }
  };
}
```

### 4. Usage Examples

```tsx
import { useResponsive, useIsMobile, useBreakpoint } from "@/hooks/useResponsive";

// Most comprehensive approach
const MyComponent = () => {
  const { isMobile, isTablet, breakpoint, largerThan } = useResponsive();
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {largerThan("md") && <LargeScreenContent />}
      <div>Current breakpoint: {breakpoint}</div>
    </div>
  );
};

// Simplified usage
const AnotherComponent = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? "mobile-layout" : "desktop-layout"}>
      {/* Component content */}
    </div>
  );
};
```

## Testing

1. Create a test component that displays current breakpoint information
2. Test across all major breakpoints to ensure detection works correctly
3. Test SSR compatibility
4. Verify orientation and hover capability detection

## Timeline

1. Component Audit - 0.5 day
2. Consolidated Implementation - 1 day
3. Component Updates - 1-2 days
4. Testing - 1 day
5. Remove Deprecated Files - 0.5 day

Total: 4-5 days 