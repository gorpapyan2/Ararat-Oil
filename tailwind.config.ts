
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#0A1929",           // Deep Navy
        primary: {
          DEFAULT: "#1E88E5",           // Professional Blue
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#334155",           // Slate Blue
          foreground: "#FFFFFF"
        },
        accent: {
          DEFAULT: "#3CCF4E",           // Success Green
          foreground: "#FFFFFF"
        },
        text: {
          base: "#F8FAFC",             // Light Text
          muted: "#94A3B8"             // Muted Text
        },
        border: "#1E293B",             // Border Color
        muted: {
          DEFAULT: "#334155",          // Muted Background
          foreground: "#3CCF4E"        // Muted with Green accent
        },
        card: {
          DEFAULT: "#0F172A",          // Card Background
          foreground: "#F8FAFC"
        },
      },
      boxShadow: {
        neumorphic: "8px 8px 16px #060D14, -8px -8px 16px #0E253E",
      },
      borderRadius: {
        lg: "1.2rem",
        md: "0.9rem",
        sm: "0.6rem"
      },
      keyframes: {
        'accordion-down': {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        'accordion-up': {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        }
      },
      animation: {
        'accordion-down': "accordion-down 0.2s ease-out",
        'accordion-up': "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
