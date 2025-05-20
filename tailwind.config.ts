/** @type {import('tailwindcss').Config} */
import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import animatePlugin from "tailwindcss-animate";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    // Base colors that should always be available
    colors: {
      white: "rgb(255 255 255)",
      black: "rgb(0 0 0)",
      transparent: 'transparent',
      current: 'currentColor',
      background: "rgb(255 255 255)",
      foreground: "rgb(17 24 39)",
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
          1: "rgb(255 255 255)",
          2: "rgb(243 244 246)",
        },
        
        primary: {
          DEFAULT: "rgb(58 166 85)",
          foreground: "rgb(255 255 255)",
        },
        
        accent: {
          DEFAULT: "rgb(246 201 14)",
          foreground: "rgb(17 24 39)",
        },
        
        card: {
          DEFAULT: "rgb(255 255 255)",
          foreground: "rgb(17 24 39)",
        },
        
        secondary: {
          DEFAULT: "rgb(241 245 249)",
          foreground: "rgb(17 24 39)",
        },
        
        muted: {
          DEFAULT: "rgb(241 245 249)",
          foreground: "rgb(107 114 128)",
        },
        
        success: {
          DEFAULT: "rgb(22 163 74)",
          foreground: "rgb(255 255 255)",
        },
        
        warning: {
          DEFAULT: "rgb(234 179 8)",
          foreground: "rgb(255 255 255)",
        },
        
        destructive: {
          DEFAULT: "rgb(239 68 68)",
          foreground: "rgb(255 255 255)",
        },
        
        info: {
          DEFAULT: "rgb(59 130 246)",
          foreground: "rgb(255 255 255)",
        },

        border: "rgb(226 232 240)",
        input: "rgb(226 232 240)",
        ring: "rgb(58 166 85)",
      },
      borderColor: {
        DEFAULT: "rgb(226 232 240)",
        border: "rgb(226 232 240)",
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
} satisfies Config;
