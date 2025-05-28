import React from "react";
import { cn } from "@/shared/utils";

interface KeyboardShortcutProps {
  combo: string[];
  className?: string;
  size?: "sm" | "md" | "lg";
  inline?: boolean;
}

/**
 * Component to display keyboard shortcuts consistently across the app
 */
export function KeyboardShortcut({
  combo,
  className,
  size = "md",
  inline = false,
}: KeyboardShortcutProps) {
  const sizes = {
    sm: "h-4 px-1 text-[10px]",
    md: "h-5 px-1.5 text-[11px]",
    lg: "h-6 px-2 text-xs",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        inline ? "inline-flex" : "flex",
        className
      )}
    >
      {combo.map((key, index) => (
        <React.Fragment key={key}>
          <kbd
            className={cn(
              "inline-flex select-none items-center justify-center rounded border",
              "bg-muted font-mono font-medium",
              "transition-all duration-150 hover:bg-muted/80",
              sizes[size]
            )}
          >
            {key}
          </kbd>
          {index < combo.length - 1 && (
            <span className="text-muted-foreground">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
