/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import animatePlugin from "tailwindcss-animate";
import tailwindcssForms from '@tailwindcss/forms';
import tailwindcssTypography from '@tailwindcss/typography';

// Enhanced custom config type with comprehensive safelist
interface EnhancedConfig extends Config {
  safelist?: (string | { pattern: RegExp; variants?: string[] })[];
}

export default {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    // Include any HTML files
    './public/**/*.html',
    './index.html',
  ],
  
  // Comprehensive safelist to prevent important classes from being purged
  safelist: [
    // Theme classes
    "dark",
    "light",
    
    // Animation classes
    "animate-spin",
    "animate-pulse", 
    "animate-bounce",
    "animate-fade-in",
    "animate-slide-up",
    "animate-slide-in-right",
    "animate-scale-in",
    "animate-shimmer",
    "animate-glow",
    
    // Component state classes
    "hover:bg-opacity-80",
    "focus:ring-2",
    "focus:ring-offset-2",
    "focus:outline-none",
    "focus-visible:ring-2",
    "active:scale-95",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    
    // Component utility classes
    "glass",
    "glass-dark",
    "text-gradient",
    "text-balance",
    "hover-lift",
    "hover-scale", 
    "hover-glow",
    "fade-in",
    "slide-up",
    "scale-in",
    "slide-in-right",
    "loading-skeleton",
    "loading-spinner",
    
    // Button variants
    "btn",
    "btn-primary",
    "btn-secondary",
    "btn-destructive",
    "btn-outline",
    "btn-ghost",
    "btn-icon",
    "btn-sm",
    "btn-lg",
    
    // Card classes
    "card",
    "card-header",
    "card-content",
    "card-footer",
    
    // Alert variants
    "alert",
    "alert-success",
    "alert-warning",
    "alert-error",
    "alert-info",
    
    // Form classes
    "input",
    "input-group",
    "input-label",
    "input-wrapper",
    "input-icon",
    "input-success",
    "input-error",
    "label",
    "textarea",
    
    // Navigation classes
    "nav",
    "nav-item",
    "nav-vertical",
    
    // Modal classes
    "modal-overlay",
    "modal-content",
    "modal-header",
    "modal-body",
    "modal-footer",
    
    // Dropdown classes
    "dropdown",
    "dropdown-trigger",
    "dropdown-content",
    "dropdown-item",
    
    // Table classes
    "table",
    "table-container",
    
    // Progress classes
    "progress",
    "progress-bar",
    "progress-lg",
    "progress-sm",
    
    // Badge variants
    "badge",
    "badge-primary",
    "badge-success",
    "badge-warning",
    "badge-error",
    "badge-neutral",
    
    // Divider classes
    "divider",
    "divider-vertical",
    "divider-text",
    
    // Layout utilities
    "container",
    "container-lg",
    "container-sm",
    "grid-auto-fit",
    "flex-center",
    "flex-between",
    
    // Tooltip
    "tooltip",
    
    // Dynamic color patterns
    {
      pattern: /^(bg|text|border)-(primary|secondary|success|warning|destructive|info|neutral)(-\d+)?$/,
      variants: ['hover', 'focus', 'active', 'dark']
    },
    
    // Grid patterns
    {
      pattern: /^grid-cols-(1|2|3|4|5|6|12)$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl']
    },
    
    // Spacing patterns for dynamic usage
    {
      pattern: /^(p|m|gap)-(0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|32)$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl']
    },
    
    // Text size patterns
    {
      pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl']
    },
    
    // Opacity patterns
    {
      pattern: /^(bg|text|border)-opacity-(5|10|20|25|30|40|50|60|70|75|80|90|95)$/
    },
    
    // Shadow patterns
    {
      pattern: /^shadow-(xs|sm|md|lg|xl|2xl|inner|glow|colored)$/
    },
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
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"'
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
        // Enhanced border system
        border: {
          DEFAULT: "hsl(var(--border))",
          subtle: 'hsl(var(--border-subtle))',
          strong: 'hsl(var(--border-strong))',
          interactive: 'hsl(var(--border-interactive))',
        },
        
        // Input and interaction colors
        input: "hsl(var(--border))",
        ring: {
          DEFAULT: "hsl(var(--ring))",
          offset: 'hsl(var(--ring-offset))',
        },
        
        // Background system
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: 'hsl(var(--background-secondary))',
        },
        
        // Foreground system
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          secondary: 'hsl(var(--foreground-secondary))',
          tertiary: 'hsl(var(--foreground-tertiary))',
        },
        
        // Surface system
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          elevated: 'hsl(var(--surface-elevated))',
          overlay: 'hsl(var(--surface-overlay))',
          pressed: 'hsl(var(--surface-pressed))',
        },
        
        // Enhanced primary palette
        primary: {
          DEFAULT: "hsl(var(--primary-500))",
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          foreground: "hsl(var(--primary-foreground))",
        },
        
        // Enhanced neutral palette
        neutral: {
          25: 'hsl(var(--neutral-25))',
          50: 'hsl(var(--neutral-50))',
          100: 'hsl(var(--neutral-100))',
          200: 'hsl(var(--neutral-200))',
          300: 'hsl(var(--neutral-300))',
          400: 'hsl(var(--neutral-400))',
          500: 'hsl(var(--neutral-500))',
          600: 'hsl(var(--neutral-600))',
          700: 'hsl(var(--neutral-700))',
          800: 'hsl(var(--neutral-800))',
          900: 'hsl(var(--neutral-900))',
        },
        
        // Secondary mapping
        secondary: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--foreground))",
        },
        
        // Enhanced semantic colors
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          50: 'hsl(var(--destructive-50))',
          100: 'hsl(var(--destructive-100))',
          foreground: "hsl(var(--destructive-foreground))",
        },
        
        success: {
          DEFAULT: "hsl(var(--success))",
          50: 'hsl(var(--success-50))',
          100: 'hsl(var(--success-100))',
          foreground: "hsl(var(--success-foreground))",
        },
        
        warning: {
          DEFAULT: "hsl(var(--warning))",
          50: 'hsl(var(--warning-50))',
          100: 'hsl(var(--warning-100))',
          foreground: "hsl(var(--warning-foreground))",
        },
        
        info: {
          DEFAULT: "hsl(var(--info))",
          50: 'hsl(var(--info-50))',
          100: 'hsl(var(--info-100))',
          foreground: "hsl(var(--info-foreground))",
        },
        
        // Component-specific colors
        muted: {
          DEFAULT: "hsl(var(--surface-elevated))",
          foreground: "hsl(var(--foreground-secondary))",
        },
        
        accent: {
          DEFAULT: "hsl(var(--surface-elevated))",
          foreground: "hsl(var(--primary))",
        },
        
        popover: {
          DEFAULT: "hsl(var(--surface-overlay))",
          foreground: "hsl(var(--foreground))",
        },
        
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--foreground))",
        },
      },
      
      // Enhanced border radius system
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "1.5rem",
      },
      
      // Enhanced opacity scale
      opacity: {
        2.5: '0.025',
        5: '0.05',
        7.5: '0.075',
        15: '0.15',
        35: '0.35',
        65: '0.65',
        85: '0.85',
        95: '0.95',
      },
      
      // Enhanced shadow system
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
        glow: '0 0 20px hsl(var(--primary) / 0.3)',
        colored: '0 10px 25px hsl(var(--primary) / 0.1)',
        'glow-lg': '0 0 30px hsl(var(--primary) / 0.4)',
        'colored-lg': '0 20px 40px hsl(var(--primary) / 0.15)',
      },
      
      // Enhanced typography
      fontSize: {
        xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-normal)' }],
        sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-normal)' }],
        base: ['var(--font-size-base)', { lineHeight: 'var(--line-height-normal)' }],
        lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-normal)' }],
        xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-normal)' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-tight)' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-tight)' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-tight)' }],
        '5xl': ['var(--font-size-5xl)', { lineHeight: 'var(--line-height-none)' }],
      },
      
      // Enhanced spacing system
      spacing: {
        px: 'var(--spacing-px)',
        0.5: 'var(--spacing-0-5)',
        1.5: 'var(--spacing-1-5)',
        2.5: 'var(--spacing-2-5)',
        3.5: 'var(--spacing-3-5)',
        14: 'var(--spacing-14)',
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
        38: '9.5rem',
        42: '10.5rem',
        46: '11.5rem',
        50: '12.5rem',
        54: '13.5rem',
        58: '14.5rem',
        62: '15.5rem',
        66: '16.5rem',
        70: '17.5rem',
        74: '18.5rem',
        78: '19.5rem',
        82: '20.5rem',
        86: '21.5rem',
        90: '22.5rem',
        94: '23.5rem',
        98: '24.5rem',
      },
      
      // Enhanced transitions
      transitionDuration: {
        75: 'var(--duration-75)',
        100: 'var(--duration-100)',
        150: 'var(--duration-150)',
        200: 'var(--duration-200)',
        250: '250ms',
        300: 'var(--duration-300)',
        400: '400ms',
        500: 'var(--duration-500)',
        600: '600ms',
        700: 'var(--duration-700)',
        800: '800ms',
        900: '900ms',
        1000: 'var(--duration-1000)',
      },
      
      // Enhanced animation keyframes
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scale-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px hsl(var(--primary) / 0.2)' },
          '50%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.4), 0 0 30px hsl(var(--primary) / 0.2)' },
        },
        'bounce-gentle': {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '40%, 43%': { transform: 'translate3d(0, -4px, 0)' },
          '70%': { transform: 'translate3d(0, -2px, 0)' },
          '90%': { transform: 'translate3d(0, -1px, 0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      
      // Enhanced animations
      animation: {
        'fade-in': 'fade-in var(--duration-300) var(--ease-out)',
        'fade-out': 'fade-out var(--duration-300) var(--ease-out)',
        'slide-up': 'slide-up var(--duration-300) var(--ease-out)',
        'slide-down': 'slide-down var(--duration-300) var(--ease-out)',
        'slide-in-right': 'slide-in-right var(--duration-300) var(--ease-out)',
        'slide-in-left': 'slide-in-left var(--duration-300) var(--ease-out)',
        'scale-in': 'scale-in var(--duration-200) var(--ease-bounce)',
        'scale-out': 'scale-out var(--duration-200) var(--ease-bounce)',
        shimmer: 'shimmer 2s var(--ease-in-out) infinite',
        'pulse-glow': 'pulse-glow 2s var(--ease-in-out) infinite',
        'bounce-gentle': 'bounce-gentle 1s infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      
      // Enhanced grid templates
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fit-sm': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fit-lg': 'repeat(auto-fit, minmax(400px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(250px, 1fr))',
        'auto-fill-sm': 'repeat(auto-fill, minmax(200px, 1fr))',
        'auto-fill-lg': 'repeat(auto-fill, minmax(350px, 1fr))',
      },
      
      // Enhanced z-index scale
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        modal: '1040',
        popover: '1050',
        tooltip: '1060',
        toast: '1070',
        notification: '1080',
      },
      
      // Enhanced backdrop blur
      backdropBlur: {
        xs: '2px',
      },
      
      // Enhanced backdrop brightness
      backdropBrightness: {
        25: '.25',
        175: '1.75',
      },
    },
  },
  
  plugins: [
    animatePlugin,
    tailwindcssForms({
      strategy: 'class', // Use class strategy to avoid conflicts
    }),
    tailwindcssTypography({
      className: 'prose',
    }),
    
    // Enhanced custom plugin with advanced utilities
    plugin(({ addUtilities, addComponents, theme, matchUtilities, addVariant }) => {
      // Add component variants for better state management
      addVariant('not-first', '&:not(:first-child)');
      addVariant('not-last', '&:not(:last-child)');
      addVariant('group-focus-within', '.group:focus-within &');
      addVariant('peer-focus-within', '.peer:focus-within ~ &');
      
      // Advanced glass effect utilities
      addUtilities({
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-strong': {
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
        
        // Premium text effects
        '.text-gradient': {
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-600)) 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.text-gradient-rainbow': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.text-balance': {
          textWrap: 'balance',
        },
        
        // Advanced interaction utilities
        '.hover-lift': {
          transition: 'transform var(--duration-200) var(--ease-out)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        '.hover-scale': {
          transition: 'transform var(--duration-200) var(--ease-out)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
        '.hover-glow': {
          transition: 'box-shadow var(--duration-200) var(--ease-out)',
          '&:hover': {
            boxShadow: '0 0 20px hsl(var(--primary) / 0.3)',
          },
        },
        '.hover-rotate': {
          transition: 'transform var(--duration-200) var(--ease-out)',
          '&:hover': {
            transform: 'rotate(5deg)',
          },
        },
        
        // Loading state utilities
        '.loading-skeleton': {
          background: 'linear-gradient(90deg, hsl(var(--surface)) 25%, hsl(var(--surface-elevated)) 50%, hsl(var(--surface)) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s var(--ease-in-out) infinite',
          borderRadius: 'var(--radius)',
        },
        '.loading-spinner': {
          width: '1.25rem',
          height: '1.25rem',
          border: '2px solid hsl(var(--border))',
          borderTop: '2px solid hsl(var(--primary))',
          borderRadius: '50%',
          animation: 'spin var(--duration-1000) var(--ease-linear) infinite',
        },
        
        // Scroll utilities
        '.scroll-smooth': {
          scrollBehavior: 'smooth',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
      
      // Advanced gradient utilities using matchUtilities for dynamic values
      matchUtilities(
        {
          'bg-gradient': (value) => ({
            background: value,
          }),
        },
        {
          values: {
            'primary': 'linear-gradient(135deg, hsl(var(--primary-500)) 0%, hsl(var(--primary-600)) 100%)',
            'surface': 'linear-gradient(135deg, hsl(var(--surface)) 0%, hsl(var(--surface-elevated)) 100%)',
            'success': 'linear-gradient(135deg, hsl(var(--success)) 0%, hsl(142 76% 30%) 100%)',
            'warning': 'linear-gradient(135deg, hsl(var(--warning)) 0%, hsl(38 92% 45%) 100%)',
            'destructive': 'linear-gradient(135deg, hsl(var(--destructive)) 0%, hsl(0 84% 55%) 100%)',
          },
        }
      );
    }),
  ],
} as EnhancedConfig;
