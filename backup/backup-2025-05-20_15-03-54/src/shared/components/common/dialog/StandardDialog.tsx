import * as React from "react";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/core/components/ui/dialog';
import { X } from "lucide-react";

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
   * @default "sm:max-w-md"
   */
  maxWidth?: string;
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
  maxWidth = "sm:max-w-md",
}: StandardDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg p-6",
            maxWidth,
            className
          )}
        >
          {showCloseButton && (
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
          
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          
          <div className="py-4">{children}</div>
          
          {actions && <DialogFooter>{actions}</DialogFooter>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
} 