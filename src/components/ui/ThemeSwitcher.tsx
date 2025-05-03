import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { ToggleButton } from "@/components/ui/toggle-button";
import useAppStore from "@/store/useAppStore";

interface ThemeSwitcherProps {
  className?: string;
  variant?: "default" | "outline";
}

export function ThemeSwitcher({
  className,
  variant = "outline",
}: ThemeSwitcherProps) {
  // Use the app store for theme management
  const { theme, setTheme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent flash of incorrect theme during hydration
  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <ToggleButton
      variant={variant}
      className={className}
      isActive={isDark}
      onToggle={(active) => {
        setTheme(active ? "dark" : "light");
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-all" />
      ) : (
        <Moon className="h-5 w-5 transition-all" />
      )}
    </ToggleButton>
  );
}
