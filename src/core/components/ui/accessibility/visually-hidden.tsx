import * as React from "react";
import { cn } from "@/shared/utils";

/**
 * VisuallyHidden component
 *
 * Renders content that is visually hidden but still accessible to screen readers.
 * This is useful for providing additional context to screen reader users
 * without affecting the visual design.
 */
const VisuallyHidden = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "absolute h-[1px] w-[1px] p-0 m-[-1px] overflow-hidden",
        "whitespace-nowrap border-0",
        "clip-[rect(0,0,0,0)]",
        "pointer-events-none",
        className
      )}
      {...props}
    />
  )
);
VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden };
