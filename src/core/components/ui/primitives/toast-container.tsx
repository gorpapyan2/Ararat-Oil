
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/hooks/use-toast";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/shared/utils";

export interface ToastContainerProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function ToastContainer({ 
  position = "bottom-right" 
}: ToastContainerProps) {
  const [mounted, setMounted] = useState(false);
  const { toasts, dismiss } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4", 
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const toastsToShow = Array.isArray(toasts) ? toasts : [];

  return createPortal(
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 w-full max-w-sm",
        positionClasses[position]
      )}
    >
      {toastsToShow.map((toast) => {
        const Icon = {
          success: Check,
          error: AlertCircle,
          warning: AlertCircle,
          info: Info,
        }[toast.variant || "info"];

        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-4 shadow-lg",
              "bg-background text-foreground",
              "animate-in slide-in-from-right-full",
              toast.variant === "error" && "border-red-500 bg-red-50 text-red-900",
              toast.variant === "success" && "border-green-500 bg-green-50 text-green-900",
              toast.variant === "warning" && "border-yellow-500 bg-yellow-50 text-yellow-900"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            
            <div className="flex-1">
              {toast.title && (
                <div className="font-medium">{toast.title}</div>
              )}
              {toast.description && (
                <div className="text-sm opacity-90">{toast.description}</div>
              )}
            </div>

            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 rounded-sm opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
