import * as React from "react";
import { useSkipToContent } from "@/hooks/use-keyboard-navigation";
import { cn } from "@/shared/utils";

interface SkipToContentProps extends React.HTMLAttributes<HTMLAnchorElement> {
  contentId?: string;
}

/**
 * SkipToContent - A component that allows keyboard users to bypass navigation
 * and jump directly to the main content. Only visible when focused.
 */
export function SkipToContent({
  contentId = "main-content",
  className,
  children = "Skip to content",
  ...props
}: SkipToContentProps) {
  const { skipLinkRef, isVisible } = useSkipToContent(contentId);

  return (
    <a
      ref={skipLinkRef}
      href={`#${contentId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:p-4 focus:bg-gray-50 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:rounded-md",
        { "sr-only": !isVisible },
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
