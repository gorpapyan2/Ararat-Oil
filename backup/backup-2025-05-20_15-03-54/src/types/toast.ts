import * as React from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  message: string; 
  duration: number;
  type: ToastType;
  action?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  createdAt: Date;
}

export type ToastActionElement = React.ReactElement<HTMLButtonElement>;
