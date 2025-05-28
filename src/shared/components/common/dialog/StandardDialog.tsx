import * as React from "react";
import { cn } from "@/shared/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/core/components/ui/primitives/dialog";
import { X } from "lucide-react";

// Define size variant classnames
const sizeVariants = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  full: "sm:max-w-full",
};

// Define position variant classnames
const positionVariants = {
  center: "top-[50%] translate-y-[-50%]",
  top: "top-[10%] translate-y-0",
};

/**
 * Props for StandardDialog component
 */
export interface StandardDialogProps {
  /**
   * Controls whether the dialog is open
   */
  open: boolean;

  /**
   * Callback fired when the dialog open state changes
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Title of the dialog
   */
  title: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Dialog content
   */
  children: React.ReactNode;

  /**
   * Footer actions, typically buttons
   */
  actions?: React.ReactNode;

  /**
   * Optional class name for the dialog container
   */
  className?: string;

  /**
   * Whether to show a close button in the top right
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Maximum width class for the dialog
   * @default "md"
   */
  size?: keyof typeof sizeVariants;

  /**
   * Custom maximum width if the size variants don't fit your need
   */
  maxWidth?: string;

  /**
   * Position of the dialog
   * @default "center"
   */
  position?: keyof typeof positionVariants;

  /**
   * Whether to prevent closing when clicking outside the dialog
   * @default false
   */
  preventOutsideClose?: boolean;
}

/**
 * StandardDialog component
 *
 * A standardized dialog component that provides consistent layout and behavior
 * for dialogs throughout the application. It includes a header with title,
 * optional description, content area, and optional footer for actions.
 *
 * Example usage:
 *
 * ```jsx
 * <StandardDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Create New Item"
 *   description="Fill out the form to create a new item."
 *   actions={<>
 *     <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
 *     <Button onClick={handleSubmit}>Save</Button>
 *   </>}
 * >
 *   <form className="space-y-4">Form fields</form>
 * </StandardDialog>
 * ```
 */
export function StandardDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  className,
  showCloseButton = true,
  size = "md",
  maxWidth,
  position = "center",
  preventOutsideClose = false,
}: StandardDialogProps) {
  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    if (!open && preventOutsideClose) {
      return;
    }
    onOpenChange(open);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] z-50 grid w-full translate-x-[-50%] gap-4 border bg-gray-50 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg p-6",
            // Use size variant from predefined sizes, or fallback to custom maxWidth, or use default md size
            maxWidth ? maxWidth : sizeVariants[size],
            // Use position variant
            positionVariants[position],
            className
          )}
          onInteractOutside={(e) => {
            if (preventOutsideClose) {
              e.preventDefault();
            }
          }}
        >
          {showCloseButton && (
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}

          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="py-4">{children}</div>

          {actions && <DialogFooter>{actions}</DialogFooter>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
