/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

export default {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './public/**/*.html',
    './index.html',
  ],
  
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont', 
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
        serif: [
          'Georgia', 
          'Cambria', 
          '"Times New Roman"', 
          'Times', 
          'serif'
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ],
      },
      
      colors: {
        // Base colors with CSS variables
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        
        // Card colors
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        
        // Popover colors
        popover: "hsl(var(--popover) / <alpha-value>)",
        "popover-foreground": "hsl(var(--popover-foreground) / <alpha-value>)",
        
        // Primary colors
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",
        
        // Secondary colors
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "hsl(var(--secondary-foreground) / <alpha-value>)",
        
        // Muted colors
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        
        // Accent colors
        accent: "hsl(var(--accent) / <alpha-value>)",
        "accent-foreground": "hsl(var(--accent-foreground) / <alpha-value>)",
        
        // Destructive colors
        destructive: "hsl(var(--destructive) / <alpha-value>)",
        "destructive-foreground": "hsl(var(--destructive-foreground) / <alpha-value>)",
        
        // Border and input
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        
        // Chart colors
        "chart-1": "hsl(var(--chart-1) / <alpha-value>)",
        "chart-2": "hsl(var(--chart-2) / <alpha-value>)",
        "chart-3": "hsl(var(--chart-3) / <alpha-value>)",
        "chart-4": "hsl(var(--chart-4) / <alpha-value>)",
        "chart-5": "hsl(var(--chart-5) / <alpha-value>)",
      },
      
      // Enhanced border radius system
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "1.5rem",
      },
      
      // Enhanced shadow system
      boxShadow: {
        'primary-5': '0 4px 14px 0 hsl(var(--primary) / 0.05)',
        'primary-10': '0 10px 25px 0 hsl(var(--primary) / 0.1)',
      },
      
      // Enhanced animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  
  plugins: [
    // Tailwind v4 has built-in line-clamp support
  ],
  
  darkMode: "class",
} satisfies Config;
