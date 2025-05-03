import * as React from "react";
import { cn } from "@/lib/utils";
import {
  DialogPrimitive,
  DialogTitlePrimitive,
  DialogDescriptionPrimitive,
  DialogContentPrimitive,
  DialogFooterPrimitive,
  DialogClosePrimitive,
  AlertDialogPrimitive,
} from "@/components/ui/primitives/dialog";
import { X } from "lucide-react";

/**
 * Base styled dialog component
 */
export const Dialog = DialogPrimitive;

/**
 * Pre-styled dialog title component
 */
export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitlePrimitive>,
  React.ComponentPropsWithoutRef<typeof DialogTitlePrimitive>
>(({ className, ...props }, ref) => (
  <DialogTitlePrimitive
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

/**
 * Pre-styled dialog description component
 */
export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogDescriptionPrimitive>,
  React.ComponentPropsWithoutRef<typeof DialogDescriptionPrimitive>
>(({ className, ...props }, ref) => (
  <DialogDescriptionPrimitive
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

/**
 * Pre-styled dialog content container component
 */
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContentPrimitive>,
  React.ComponentPropsWithoutRef<typeof DialogContentPrimitive>
>(({ className, ...props }, ref) => (
  <DialogContentPrimitive
    ref={ref}
    className={cn("my-4", className)}
    {...props}
  />
));
DialogContent.displayName = "DialogContent";

/**
 * Pre-styled dialog footer component for actions
 */
export const DialogFooter = React.forwardRef<
  React.ElementRef<typeof DialogFooterPrimitive>,
  React.ComponentPropsWithoutRef<typeof DialogFooterPrimitive>
>(({ className, ...props }, ref) => (
  <DialogFooterPrimitive
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

/**
 * Pre-styled dialog close button
 */
export const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogClosePrimitive>,
  React.ComponentPropsWithoutRef<typeof DialogClosePrimitive>
>(({ className, ...props }, ref) => (
  <DialogClosePrimitive
    ref={ref}
    className={cn(
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </DialogClosePrimitive>
));
DialogClose.displayName = "DialogClose";

/**
 * Pre-styled alert dialog root component
 */
export const AlertDialog = AlertDialogPrimitive;

/**
 * Pre-styled alert dialog title with styling based on severity
 */
export const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitlePrimitive>,
  React.ComponentPropsWithoutRef<typeof DialogTitlePrimitive> & {
    severity?: "info" | "warning" | "danger";
  }
>(({ className, severity = "info", ...props }, ref) => {
  const severityClasses = {
    info: "text-blue-700 dark:text-blue-400",
    warning: "text-amber-700 dark:text-amber-400",
    danger: "text-red-700 dark:text-red-400",
  };

  return (
    <DialogTitlePrimitive
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        severityClasses[severity],
        className
      )}
      {...props}
    />
  );
});
AlertDialogTitle.displayName = "AlertDialogTitle";

/**
 * Pre-styled alert dialog description
 */
export const AlertDialogDescription = DialogDescription;

/**
 * Pre-styled alert dialog content container
 */
export const AlertDialogContent = DialogContent;

/**
 * Pre-styled alert dialog footer
 */
export const AlertDialogFooter = React.forwardRef<
  React.ElementRef<typeof DialogFooterPrimitive>,
  React.ComponentPropsWithoutRef<typeof DialogFooterPrimitive>
>(({ className, ...props }, ref) => (
  <DialogFooterPrimitive
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-0 sm:space-x-2",
      className
    )}
    {...props}
  />
));
AlertDialogFooter.displayName = "AlertDialogFooter";

/**
 * Pre-styled dialog header container
 */
export const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-left", className)}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

/**
 * Alert dialog wrapper for the header component
 */
export const AlertDialogHeader = DialogHeader;