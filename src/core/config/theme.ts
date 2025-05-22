/**
 * Theme Configuration
 * 
 * This file contains theme-related configuration, including color schemes,
 * default themes, and other theming options.
 */

/**
 * Available theme options
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Theme configuration object
 */
export const THEME_CONFIG = {
  // Default theme
  DEFAULT_THEME: 'system' as Theme,
  
  // Storage key for persisting theme preference
  STORAGE_KEY: 'theme',
  
  // CSS class names for themes
  THEME_CLASSES: {
    LIGHT: 'light',
    DARK: 'dark',
  },
  
  // Media query for detecting system preference
  SYSTEM_DARK_MODE_QUERY: '(prefers-color-scheme: dark)',
  
  // Animation settings for theme transitions
  TRANSITION: {
    DURATION: '200ms',
    TIMING: 'ease-in-out',
  },
};

/**
 * Color palette configuration for theming UI components
 */
export const COLOR_PALETTE = {
  // Primary colors
  PRIMARY: {
    LIGHT: 'var(--color-primary)',
    DARK: 'var(--color-primary)',
  },
  
  // Background colors
  BACKGROUND: {
    LIGHT: 'var(--color-background)',
    DARK: 'var(--color-background)',
  },
  
  // Foreground colors
  FOREGROUND: {
    LIGHT: 'var(--color-foreground)',
    DARK: 'var(--color-foreground)',
  },
  
  // Card colors
  CARD: {
    LIGHT: 'var(--color-card)',
    DARK: 'var(--color-card)',
  },
  
  // Muted colors
  MUTED: {
    LIGHT: 'var(--color-muted)',
    DARK: 'var(--color-muted)',
  },
  
  // Accent colors
  ACCENT: {
    LIGHT: 'var(--color-accent)',
    DARK: 'var(--color-accent)',
  },
};

/**
 * UI component specific theme settings
 */
export const COMPONENT_THEMES = {
  // Modal/dialog backdrop opacity
  MODAL_BACKDROP_OPACITY: {
    LIGHT: '0.60',
    DARK: '0.80',
  },
  
  // Shadow opacity
  SHADOW_OPACITY: {
    LIGHT: '0.08',
    DARK: '0.2',
  },
  
  // Border opacity
  BORDER_OPACITY: {
    LIGHT: '0.1',
    DARK: '0.15',
  },
};

/**
 * Font configuration
 */
export const FONT_CONFIG = {
  SIZES: {
    XS: '0.75rem',
    SM: '0.875rem',
    BASE: '1rem',
    LG: '1.125rem',
    XL: '1.25rem',
    '2XL': '1.5rem',
    '3XL': '1.875rem',
    '4XL': '2.25rem',
  },
  
  WEIGHTS: {
    LIGHT: '300',
    NORMAL: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
  },
  
  FAMILIES: {
    SANS: 'var(--font-sans)',
    MONO: 'var(--font-mono)',
    HEADING: 'var(--font-heading)',
  },
};

/**
 * Animation configuration
 */
export const ANIMATION_CONFIG = {
  DURATIONS: {
    FAST: '100ms',
    NORMAL: '200ms',
    SLOW: '300ms',
    VERY_SLOW: '500ms',
  },
  
  EASINGS: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    LINEAR: 'linear',
    IN: 'cubic-bezier(0.4, 0, 1, 1)',
    OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

/**
 * Layout configuration
 */
export const LAYOUT_CONFIG = {
  SIDEBAR: {
    EXPANDED_WIDTH: '240px',
    COLLAPSED_WIDTH: '70px',
    TRANSITION: `width ${ANIMATION_CONFIG.DURATIONS.NORMAL} ${ANIMATION_CONFIG.EASINGS.IN_OUT}`,
  },
  
  CONTAINER: {
    MAX_WIDTH: '1400px',
    GUTTER: '1rem',
  },
  
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
}; 