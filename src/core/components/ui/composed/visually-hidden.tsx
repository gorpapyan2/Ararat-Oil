import * as React from "react";

import { cn } from "@/shared/utils";

const VisuallyHidden = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "absolute h-px w-px p-0 overflow-hidden whitespace-nowrap border-0",
        "clip-rect-0 clip-rect-0 clip-rect-0 clip-rect-0",
        className
      )}
      {...props}
    />
  )
);
VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden };
