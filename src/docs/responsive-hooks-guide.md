# Responsive Hooks Guide

This guide documents our consolidated responsive hooks implementation which provides a comprehensive solution for handling responsive design across our application.

## Overview

The responsive hooks package offers a complete solution for responsive design needs in React applications. It provides a set of hooks for detecting various device characteristics and viewport sizes, enabling responsive UI adjustments and optimal user experience across different devices.

## Key Features

- **Device Type Detection**: Easily identify mobile, tablet, and desktop devices
- **Breakpoint-Based Logic**: Access current breakpoint and make comparisons
- **Accessibility Features**: Detect user preferences like reduced motion and dark mode
- **Device Capabilities**: Check for features like hover support
- **Responsive Utilities**: Helper functions for comparing breakpoints
- **SSR Compatibility**: Safe to use with server-side rendering

## Installation

The responsive hooks are built into the application. You can import them directly from the `@/hooks/useResponsive` path:

```tsx
import {
  useResponsive,
  useIsMobile,
  useMediaQuery,
} from "@/hooks/useResponsive";
```

## Basic Usage

### Device Type Detection

```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from "@/hooks/useResponsive";

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

### Current Breakpoint

```tsx
import { useBreakpoint } from "@/hooks/useResponsive";

function BreakpointAwareComponent() {
  const breakpoint = useBreakpoint();

  return (
    <div>
      <p>Current breakpoint: {breakpoint}</p>
      {/* Renders "xs", "sm", "md", "lg", "xl", or "xxl" */}
    </div>
  );
}
```

### Media Query Usage

```tsx
import { useMediaQuery } from "@/hooks/useResponsive";

function CustomQueryComponent() {
  const isWideScreen = useMediaQuery("(min-width: 1600px)");
  const isLandscape = useMediaQuery("(orientation: landscape)");

  return (
    <div>
      {isWideScreen && <WideScreenContent />}
      {isLandscape && <LandscapeContent />}
    </div>
  );
}
```

## Advanced Usage

### All-in-One Hook

```tsx
import { useResponsive } from "@/hooks/useResponsive";

function AdvancedResponsiveComponent() {
  const responsive = useResponsive();

  return (
    <div>
      <h2>Current State</h2>
      <p>Breakpoint: {responsive.breakpoint}</p>
      <p>Is Mobile: {responsive.isMobile ? "Yes" : "No"}</p>
      <p>Has Hover: {responsive.hasHover ? "Yes" : "No"}</p>

      <h2>Comparisons</h2>
      {responsive.smallerThan("md") && <p>Smaller than medium screens</p>}
      {responsive.between("sm", "lg") && <p>Between small and large screens</p>}
      {responsive.largerThan("xl") && <p>Extra large screen detected</p>}
    </div>
  );
}
```

### Accessibility Features

```tsx
import {
  usePrefersReducedMotion,
  usePrefersDarkMode,
} from "@/hooks/useResponsive";

function AccessibleComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const prefersDarkMode = usePrefersDarkMode();

  // Adjust animations based on user preference
  const animationStyle = prefersReducedMotion
    ? { transition: "none" }
    : { transition: "all 0.3s ease" };

  return (
    <div style={animationStyle}>
      <p>This component respects user preferences for reduced motion</p>
      <p>User prefers dark mode: {prefersDarkMode ? "Yes" : "No"}</p>
    </div>
  );
}
```

## API Reference

### Breakpoints

The responsive hooks use the following breakpoint values (in pixels):

| Breakpoint | Value (px) | Description         |
| ---------- | ---------- | ------------------- |
| XS         | 480        | Extra small screens |
| SM         | 640        | Small screens       |
| MD         | 768        | Medium screens      |
| LG         | 1024       | Large screens       |
| XL         | 1280       | Extra large screens |
| XXL        | 1536       | 2x extra large      |

### Available Hooks

| Hook                    | Return Type | Description                        |
| ----------------------- | ----------- | ---------------------------------- |
| useMediaQuery           | boolean     | Match any CSS media query          |
| useIsMobile             | boolean     | Is viewport mobile sized           |
| useIsTablet             | boolean     | Is viewport tablet sized           |
| useIsDesktop            | boolean     | Is viewport desktop sized          |
| useBreakpoint           | string      | Current breakpoint name            |
| useIsPortrait           | boolean     | Is orientation portrait            |
| useHasHover             | boolean     | Does device support hover          |
| usePrefersReducedMotion | boolean     | Does user prefer reduced motion    |
| usePrefersDarkMode      | boolean     | Does user prefer dark color scheme |
| useResponsive           | object      | Comprehensive responsive utilities |

### useResponsive API

The `useResponsive` hook returns an object with the following properties:

| Property             | Type     | Description                        |
| -------------------- | -------- | ---------------------------------- |
| breakpoint           | string   | Current breakpoint name            |
| isMobile             | boolean  | Is viewport mobile sized           |
| isTablet             | boolean  | Is viewport tablet sized           |
| isDesktop            | boolean  | Is viewport desktop sized          |
| isPortrait           | boolean  | Is orientation portrait            |
| hasHover             | boolean  | Does device support hover          |
| prefersReducedMotion | boolean  | Does user prefer reduced motion    |
| prefersDarkMode      | boolean  | Does user prefer dark color scheme |
| smallerThan          | function | Compare if smaller than breakpoint |
| largerThan           | function | Compare if larger than breakpoint  |
| between              | function | Check if between two breakpoints   |
| isExactly            | function | Check if exactly at a breakpoint   |
| values               | object   | Breakpoint values in pixels        |

## Migration Guide

If you were previously using `useIsMobile` from `@/hooks/use-mobile` or `useMediaQuery` from `@/hooks/use-media-query`, you should update your imports to use the new consolidated hooks:

```diff
- import { useIsMobile } from "@/hooks/use-mobile";
+ import { useIsMobile } from "@/hooks/useResponsive";

- import { useMediaQuery } from "@/hooks/use-media-query";
+ import { useMediaQuery } from "@/hooks/useResponsive";
```

The API is backward compatible, so your existing code should continue to work without changes.

## Best Practices

1. **Prefer Tailwind Classes**: For simple responsive layouts, use Tailwind's responsive classes when possible
   (e.g., `className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"`)

2. **Use Hooks for Complex Logic**: Use these hooks when you need conditional rendering or complex responsive behavior
   that can't be handled with CSS alone

3. **Avoid Multiple Queries**: Instead of using multiple `useMediaQuery` calls, use the `useResponsive` hook to access
   all responsive values with a single hook

4. **Respect User Preferences**: Always check for and respect `prefersReducedMotion` when implementing animations

5. **Testing**: Test your responsive components on different devices to ensure they behave as expected
