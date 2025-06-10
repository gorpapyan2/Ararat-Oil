/**
 * This file provides a toast container component compatible with our toast system.
 */

import React from "react";
import { useToast } from "@/core/hooks/useToast";
import { cn } from "@/shared/utils";

interface ToastContainerProps {
  className?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function ToastContainer({
  className,
  position = "top-right",
}: ToastContainerProps) {
  // Since our current useToast hook doesn't expose a toasts array,
  // we'll create a simplified container that just provides the mounting point
  
  // Position classes
  const positionClasses = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
  } as const;

  return (
    <div
      className={cn(
        "fixed z-[9999] p-4 space-y-4 max-h-screen overflow-hidden pointer-events-none",
        positionClasses[position],
        className
      )}
      role="region"
      aria-label="Notifications"
      id="toast-container"
    >
      {/* Toast notifications will be injected here by the toast system */}
    </div>
  );
}
