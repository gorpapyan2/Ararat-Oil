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
        background: {
          light: "#F7F9F8",
          dark: "#1A1A1A",
        },
        primary: {
          DEFAULT: "#3AA655",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F6C90E",
          foreground: "#1A1A1A",
        },
        text: {
          light: "#333333",
          dark: "#E0E0E0",
        },
        card: {
          light: "#FFFFFF",
          dark: "#262626",
        },
        border: "#1E293B",             // Border Color
        muted: {
          DEFAULT: "#334155",          // Muted Background
          foreground: "#3CCF4E"        // Muted with Green accent
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
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
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
