/** @type {import('tailwindcss').Config} */
import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import animatePlugin from "tailwindcss-animate";

// Define a custom config type that includes safelist
type CustomConfig = Config & {
  safelist?: string[];
};

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // Add critical styles to safelist to prevent them from being purged
  safelist: [
    // Base colors
    'bg-white', 'bg-black', 'text-white', 'text-black',
    // Theme colors
    'bg-background', 'text-foreground',
    'bg-primary', 'text-primary',
    // Critical UI elements
    'dark:bg-gray-800', 'dark:text-gray-50',
    'border-border', 'border-primary', 
    'bg-30', 'bg-10', 'bg-40', 'bg-50',
    // Numeric variables
    'border-30', 'border-10'
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    // Base colors that should always be available (in RGB format for Tailwind v4)
    colors: {
      white: "rgb(255 255 255)",
      black: "rgb(0 0 0)",
      transparent: 'transparent',
      current: 'currentColor',
      background: "var(--color-background)",
      foreground: "var(--color-foreground)",
      gray: {
        50: "rgb(249 250 251)",
        100: "rgb(243 244 246)",
        200: "rgb(229 231 235)",
        300: "rgb(209 213 219)",
        400: "rgb(156 163 175)",
        500: "rgb(107 114 128)",
        600: "rgb(75 85 99)",
        700: "rgb(55 65 81)",
        800: "rgb(31 41 55)",
        900: "rgb(17 24 39)",
      },
      red: {
        500: "rgb(239 68 68)",
      },
      green: {
        600: "rgb(22 163 74)",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', "Times New Roman", 'Times', 'serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      },
      colors: {
        surface: {
          1: "var(--color-surface-1)",
          2: "var(--color-surface-2)",
        },
        
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        
        success: {
          DEFAULT: "var(--color-success)",
          foreground: "var(--color-success-foreground)",
        },
        
        warning: {
          DEFAULT: "var(--color-warning)",
          foreground: "var(--color-warning-foreground)",
        },
        
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        
        info: {
          DEFAULT: "var(--color-info)",
          foreground: "var(--color-info-foreground)",
        },

        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        
        // Numeric scales for flexibility
        10: "var(--color-10)",
        30: "var(--color-30)",
        40: "var(--color-40)",
        50: "var(--color-50)",
        80: "var(--color-80)",
        90: "var(--color-90)",
      },
      borderColor: {
        DEFAULT: "var(--color-border)",
        border: "var(--color-border)",
        // Add numeric border colors for more flexibility
        10: "var(--color-10)",
        30: "var(--color-30)",
        40: "var(--color-40)",
        50: "var(--color-50)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      opacity: {
        5: '0.05',
        10: '0.1',
        30: '0.3',
        50: '0.5',
        80: '0.8',
        90: '0.9',
        95: '0.95',
      },
    },
  },
  plugins: [
    animatePlugin,
    plugin(({ addUtilities }) => {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".backdrop-blur-sm": {
          "backdrop-filter": "blur(4px)",
        },
        ".backdrop-blur": {
          "backdrop-filter": "blur(8px)",
        },
        ".backdrop-blur-md": {
          "backdrop-filter": "blur(12px)",
        },
        ".backdrop-blur-lg": {
          "backdrop-filter": "blur(16px)",
        },
        ".backdrop-blur-xl": {
          "backdrop-filter": "blur(24px)",
        },
        ".backdrop-blur-2xl": {
          "backdrop-filter": "blur(40px)",
        },
        ".backdrop-blur-3xl": {
          "backdrop-filter": "blur(64px)",
        },
      });
    }),
  ],
} as CustomConfig;
