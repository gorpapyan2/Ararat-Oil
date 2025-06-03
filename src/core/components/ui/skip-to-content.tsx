import * as React from "react";
import { cn } from "@/shared/utils";

interface SkipToContentProps extends React.HTMLAttributes<HTMLAnchorElement> {
  contentId?: string;
  children?: React.ReactNode;
}

/**
 * SkipToContent component
 * Provides accessibility navigation to skip to main content
 * Only visible when focused via keyboard navigation
 */
export function SkipToContent({ 
  className, 
  contentId = "main-content",
  children = "Skip to main content",
  ...props 
}: SkipToContentProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(contentId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${contentId}`}
      onClick={handleClick}
      className={cn(
        // Screen reader only by default
        "sr-only",
        // Visible and styled when focused
        "focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4",
        "focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground",
        "focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring",
        "focus:font-medium focus:text-sm focus:no-underline",
        "transition-all duration-150",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
