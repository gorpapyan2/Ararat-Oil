
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
        background: "#000000",            // Deep Black
        primary: {
          DEFAULT: "#3E432E",            // Dark Olive
          foreground: "#F1F5F9"
        },
        secondary: {
          DEFAULT: "#616F39",            // Medium Olive
          foreground: "#F1F5F9"
        },
        accent: {
          DEFAULT: "#A7D129",            // Bright Lime
          foreground: "#000000"
        },
        text: {
          base: "#F1F5F9",
          muted: "#9CA3AF"
        },
        border: "#273018",               // for subtle borders (derived from palette)
        muted: {
          DEFAULT: "#616F39",
          foreground: "#A7D129"          // muted olive with lime accent
        },
        card: {
          DEFAULT: "#3E432E",
          foreground: "#F1F5F9"
        },
      },
      boxShadow: {
        neumorphic: "8px 8px 16px #2a2e23, -8px -8px 16px #4e5642",
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
