import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

/**
 * A hook for managing the theme with support for light, dark, and system preferences
 * @returns Object with current theme and setter function
 */
export function useTheme() {
  // Initialize theme from localStorage or default to system
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedTheme = window.localStorage.getItem("theme") as Theme;
      if (storedTheme) {
        return storedTheme;
      }
    }

    return "system";
  });

  // Resolve the effective theme (light or dark) based on theme setting and system preference
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (theme === "system" && typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme === "dark" ? "dark" : "light";
  });

  // Update the theme in localStorage and document when it changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove previous theme class
    root.classList.remove("light", "dark");

    // Store in localStorage
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);

      // Apply theme class
      let effectiveTheme = theme;

      if (theme === "system") {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
      }

      // Apply theme class to document
      root.classList.add(effectiveTheme);
      setResolvedTheme(effectiveTheme === "dark" ? "dark" : "light");
    }
  }, [theme]);

  // Watch for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const root = window.document.documentElement;
      const systemTheme = mediaQuery.matches ? "dark" : "light";

      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme === "dark" ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Custom setter for theme that performs validation
  const setTheme = (newTheme: Theme) => {
    if (["light", "dark", "system"].includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === "dark",
    isLight: resolvedTheme === "light",
    isSystem: theme === "system",
  };
}
