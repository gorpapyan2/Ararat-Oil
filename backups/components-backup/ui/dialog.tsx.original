import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { VisuallyHidden } from "./visually-hidden";
import { useFocusTrap } from "@/hooks/use-keyboard-navigation";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
      className
    )}
    aria-label={props["aria-label"] || "Close dialog"}
    {...props}
  >
    {children || <X className="h-4 w-4" />}
    {!children && <span className="sr-only">Close</span>}
  </DialogPrimitive.Close>
));
DialogClose.displayName = "DialogClose";

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    title?: string;
    /**
     * Optional description for screenreaders if no DialogDescription is provided
     */
    screenReaderDescription?: string;
    /**
     * Controls if the close button should be shown
     * @default true
     */
    showCloseButton?: boolean;
  }
>(
  (
    {
      className,
      children,
      title = "Dialog",
      screenReaderDescription,
      showCloseButton = true,
      ...props
    },
    ref,
  ) => {
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Use custom focus trap - this works alongside Radix UI's focus handling
    useFocusTrap(contentRef, true);

    // Store the previously focused element
    const previousFocusRef = React.useRef<HTMLElement | null>(null);

    // Remember the active element when the dialog opens and restore on close
    React.useEffect(() => {
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Set focus to the dialog content when it opens
      if (contentRef.current) {
        // Small delay to ensure the dialog is fully rendered
        setTimeout(() => {
          // Find the first focusable element in the dialog
          const focusableElements = contentRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
          } else {
            // If no focusable elements, focus the content itself
            contentRef.current?.focus();
          }
        }, 50);
      }

      return () => {
        // Return focus on unmount with a small delay to prevent focus issues
        setTimeout(() => {
          previousFocusRef.current?.focus();
        }, 10);
      };
    }, []);

    // Generate a unique ID for the hidden title
    const hiddenTitleId = React.useId();
    
    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={(node) => {
            // Handle both refs
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            if (contentRef.current !== null && node !== null) {
              contentRef.current = node;
            }
          }}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg p-6",
            className,
          )}
          // Add additional ARIA attributes for better screen reader support
          aria-modal="true"
          role="dialog"
          // Always use the hidden title ID to ensure accessibility
          aria-labelledby={hiddenTitleId}
          aria-describedby={
            screenReaderDescription ? `${hiddenTitleId}-desc` : undefined
          }
          // Allow the dialog content to receive focus
          tabIndex={-1}
          {...props}
        >
          {/* Always render a visually hidden title for screen readers */}
          <VisuallyHidden>
            <DialogTitle id={hiddenTitleId}>{title}</DialogTitle>
            {screenReaderDescription && (
              <div id={`${hiddenTitleId}-desc`}>{screenReaderDescription}</div>
            )}
          </VisuallyHidden>
          
          {children}
          
          {showCloseButton && (
            <DialogClose />
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
