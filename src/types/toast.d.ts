import * as React from "react";

/**
 * ToastOptions interface that extends the base toast options
 * with additional properties used in our application
 */
export interface ToastOptions {
  title?: string;
  description?: string;
  message?: string;
  duration?: number;
  type?: ToastType;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  action?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Supported toast types
 */
export type ToastType = "info" | "success" | "warning" | "error";

/**
 * Toast data structure
 */
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  message?: string;
  duration: number;
  type: ToastType;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  action?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  createdAt: Date;
} 