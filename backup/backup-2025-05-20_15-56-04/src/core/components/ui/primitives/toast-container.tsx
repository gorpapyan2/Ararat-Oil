import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, AlertCircle, Info } from "lucide-react";
import { useAppStore, selectToasts } from "@/core/store";
import { useToast } from "@/hooks";
import { cn } from "@/shared/utils";
import { Toast as ToastType } from "@/types/toast";

interface ToastContainerProps {
  className?: string;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function ToastContainer({ 
  className, 
  position = "bottom-right" 
}: ToastContainerProps) {
  // Use our consolidated hook to access toasts
  const { dismiss } = useToast();
  
  // Use selector to access toasts from store
  const toasts = useAppStore(selectToasts);

  // Position classes
  const positionClasses = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
  } as const;

  // Handle keyboard navigation and accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close most recent toast on Escape
      if (e.key === "Escape" && toasts.length > 0) {
        dismiss(toasts[0].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toasts, dismiss]);

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-50 p-4 space-y-4 max-h-screen overflow-hidden pointer-events-none",
        positionClasses[position],
        className,
      )}
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: position.startsWith("top") ? -50 : 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg",
              "border p-4 backdrop-blur-sm flex items-start",
              toast.type === "success" &&
                "bg-green-800/90 border-green-700 text-white",
              toast.type === "error" &&
                "bg-destructive/90 border-destructive/70 text-white",
              toast.type === "warning" &&
                "bg-amber-600/90 border-amber-500 text-white",
              toast.type === "info" &&
                "bg-primary/90 border-primary/70 text-white",
            )}
            role="alert"
            aria-atomic="true"
          >
            <div className="shrink-0 pt-0.5 mr-3">
              {toast.type === "success" && <Check className="h-5 w-5" />}
              {toast.type === "error" && <AlertCircle className="h-5 w-5" />}
              {toast.type === "warning" && <AlertCircle className="h-5 w-5" />}
              {toast.type === "info" && <Info className="h-5 w-5" />}
            </div>

            <div className="flex-1">
              {toast.title && (
                <p className="text-sm font-medium">{toast.title}</p>
              )}
              <p className={cn("text-sm", toast.title && "mt-1")}>
                {toast.message || toast.description}
              </p>
              {toast.action && (
                <div className="mt-2">
                  {toast.action}
                </div>
              )}
            </div>

            <button
              type="button"
              className="ml-4 flex-shrink-0 rounded-md p-1 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white"
              onClick={() => {
                dismiss(toast.id);
                toast.onOpenChange?.(false);
              }}
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
