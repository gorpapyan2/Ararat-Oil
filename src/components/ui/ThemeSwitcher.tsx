import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAppStore from "@/store/useAppStore";

interface ThemeSwitcherProps {
  className?: string;
  variant?: "ghost" | "accent" | "default" | "outline";
}

export function ThemeSwitcher({ 
  className,
  variant = "ghost" 
}: ThemeSwitcherProps) {
  // Use the app store for theme management
  const { theme, setTheme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme change
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  // Prevent flash of incorrect theme during hydration
  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size="icon"
      className={className}
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 transition-all" />
      ) : (
        <Sun className="h-5 w-5 transition-all" />
      )}
      <span className="sr-only">
        {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      </span>
    </Button>
  );
} 