/**
 * AraraTOil Design System
 *
 * A comprehensive design system for the Fuel Station Management application
 * with support for both light and dark modes, consistent spacing, and
 * typography guidelines.
 */

// =============================================================================
// COLOR SYSTEM
// =============================================================================

export const colors = {
  // Primary brand colors
  primary: {
    50: "hsl(215, 100%, 97%)",
    100: "hsl(215, 100%, 92%)",
    200: "hsl(215, 95%, 84%)",
    300: "hsl(215, 90%, 76%)",
    400: "hsl(215, 90%, 67%)",
    500: "hsl(215, 90%, 57%)", // Main primary
    600: "hsl(215, 80%, 50%)",
    700: "hsl(215, 80%, 40%)",
    800: "hsl(215, 80%, 30%)",
    900: "hsl(215, 80%, 20%)",
    950: "hsl(215, 90%, 10%)",
  },

  // Gray scale for text, backgrounds, borders
  gray: {
    50: "hsl(220, 20%, 98%)",
    100: "hsl(220, 15%, 95%)",
    200: "hsl(220, 15%, 91%)",
    300: "hsl(220, 10%, 85%)",
    400: "hsl(220, 10%, 70%)",
    500: "hsl(220, 10%, 50%)",
    600: "hsl(220, 10%, 40%)",
    700: "hsl(220, 10%, 30%)",
    800: "hsl(220, 10%, 20%)",
    900: "hsl(220, 15%, 15%)",
    950: "hsl(220, 20%, 10%)",
  },

  // Semantic colors for success, error, warning
  success: {
    50: "hsl(145, 80%, 96%)",
    100: "hsl(145, 80%, 92%)",
    200: "hsl(145, 75%, 84%)",
    300: "hsl(145, 70%, 70%)",
    400: "hsl(145, 65%, 55%)",
    500: "hsl(145, 65%, 42%)", // Main success
    600: "hsl(145, 65%, 36%)",
    700: "hsl(145, 65%, 30%)",
    800: "hsl(145, 70%, 24%)",
    900: "hsl(145, 70%, 18%)",
    950: "hsl(145, 80%, 10%)",
  },

  error: {
    50: "hsl(0, 100%, 97%)",
    100: "hsl(0, 100%, 95%)",
    200: "hsl(0, 100%, 90%)",
    300: "hsl(0, 95%, 82%)",
    400: "hsl(0, 90%, 70%)",
    500: "hsl(0, 85%, 60%)", // Main error
    600: "hsl(0, 80%, 50%)",
    700: "hsl(0, 80%, 40%)",
    800: "hsl(0, 80%, 30%)",
    900: "hsl(0, 80%, 25%)",
    950: "hsl(0, 90%, 15%)",
  },

  warning: {
    50: "hsl(40, 100%, 97%)",
    100: "hsl(40, 100%, 92%)",
    200: "hsl(40, 95%, 85%)",
    300: "hsl(40, 90%, 75%)",
    400: "hsl(40, 90%, 65%)",
    500: "hsl(40, 90%, 55%)", // Main warning
    600: "hsl(40, 80%, 48%)",
    700: "hsl(40, 80%, 40%)",
    800: "hsl(40, 80%, 30%)",
    900: "hsl(40, 80%, 22%)",
    950: "hsl(40, 90%, 12%)",
  },

  // Theme semantic colors (calculated based on mode)
  theme: {
    // Surface and background colors
    background: "var(--background)", // Main app background
    foreground: "var(--foreground)", // Main text color
    card: "var(--card)", // Card background
    cardForeground: "var(--card-foreground)", // Card text color
    popover: "var(--popover)", // Popover background
    popoverForeground: "var(--popover-foreground)", // Popover text color

    // UI element colors
    primary: "var(--primary)", // Primary actions
    primaryForeground: "var(--primary-foreground)", // Text on primary bg
    secondary: "var(--secondary)", // Secondary actions
    secondaryForeground: "var(--secondary-foreground)", // Text on secondary bg
    muted: "var(--muted)", // Muted elements
    mutedForeground: "var(--muted-foreground)", // Text on muted bg
    accent: "var(--accent)", // Accent elements
    accentForeground: "var(--accent-foreground)", // Text on accent bg

    // Border colors
    border: "var(--border)", // Default border
    input: "var(--input)", // Input border

    // State colors
    destructive: "var(--destructive)", // Destructive actions
    destructiveForeground: "var(--destructive-foreground)", // Text on destructive bg
    success: "var(--success)", // Success state
    successForeground: "var(--success-foreground)", // Text on success bg
    warning: "var(--warning)", // Warning state
    warningForeground: "var(--warning-foreground)", // Text on warning bg

    // UI feedback
    ring: "var(--ring)", // Focus rings
  },
};

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

export const typography = {
  // Font families
  fontFamily: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },

  // Font weights
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  // Font sizes with matching line heights
  fontSize: {
    xs: {
      size: "0.75rem", // 12px
      lineHeight: "1rem", // 16px
    },
    sm: {
      size: "0.875rem", // 14px
      lineHeight: "1.25rem", // 20px
    },
    base: {
      size: "1rem", // 16px
      lineHeight: "1.5rem", // 24px
    },
    lg: {
      size: "1.125rem", // 18px
      lineHeight: "1.75rem", // 28px
    },
    xl: {
      size: "1.25rem", // 20px
      lineHeight: "1.875rem", // 30px
    },
    "2xl": {
      size: "1.5rem", // 24px
      lineHeight: "2rem", // 32px
    },
    "3xl": {
      size: "1.875rem", // 30px
      lineHeight: "2.375rem", // 38px
    },
    "4xl": {
      size: "2.25rem", // 36px
      lineHeight: "2.75rem", // 44px
    },
    "5xl": {
      size: "3rem", // 48px
      lineHeight: "3.5rem", // 56px
    },
  },

  // Heading styles (combines size, weight, and line height)
  headings: {
    h1: {
      fontSize: "1.875rem", // 30px
      lineHeight: "2.375rem", // 38px
      fontWeight: "700",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "1.5rem", // 24px
      lineHeight: "2rem", // 32px
      fontWeight: "600",
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.25rem", // 20px
      lineHeight: "1.875rem", // 30px
      fontWeight: "600",
      letterSpacing: "-0.01em",
    },
    h4: {
      fontSize: "1.125rem", // 18px
      lineHeight: "1.75rem", // 28px
      fontWeight: "600",
      letterSpacing: "0",
    },
    h5: {
      fontSize: "1rem", // 16px
      lineHeight: "1.5rem", // 24px
      fontWeight: "600",
      letterSpacing: "0",
    },
    h6: {
      fontSize: "0.875rem", // 14px
      lineHeight: "1.25rem", // 20px
      fontWeight: "600",
      letterSpacing: "0",
    },
  },
};

// =============================================================================
// SPACING SYSTEM
// =============================================================================

export const spacing = {
  // Base spacing unit (4px)
  unit: "0.25rem",

  // Spacing scale
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
};

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  none: "none",
};
