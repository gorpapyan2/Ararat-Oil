import * as React from "react";
import { useId } from "react";

/**
 * Utility function to combine multiple refs
 */
function useCombinedRefs<T>(...refs: Array<React.Ref<T> | null | undefined>) {
  const targetRef = React.useRef<T>(null);
  
  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;
      
      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        (ref as React.MutableRefObject<T | null>).current = targetRef.current;
      }
    });
  }, [refs]);
  
  return targetRef;
}

/**
 * Gets all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(
    el => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
  ) as HTMLElement[];
}

export interface DialogPrimitiveProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Controls whether the dialog is open
   */
  open: boolean;
  /**
   * Callback fired when the dialog open state changes
   */
  onOpenChange: (open: boolean) => void;
  /**
   * The element that triggered the dialog, used to return focus when closed
   */
  triggerRef?: React.RefObject<HTMLElement>;
  /**
   * Title of the dialog, for accessibility
   */
  title: string;
  /**
   * Optional description of the dialog, for accessibility
   */
  description?: string;
  /**
   * Whether the dialog is modal (blocks interaction with the rest of the page)
   */
  modal?: boolean;
}

/**
 * Base primitive dialog component with focus management and accessibility
 */
export const DialogPrimitive = React.forwardRef<HTMLDivElement, DialogPrimitiveProps>(
  (
    {
      open,
      onOpenChange,
      triggerRef,
      children,
      title,
      description,
      modal = true,
      ...props
    },
    forwardedRef
  ) => {
    // Create refs for focus management
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const combinedRef = useCombinedRefs(forwardedRef, dialogRef);
    
    // Create IDs for accessibility attributes
    const titleId = useId();
    const descriptionId = useId();
    
    // Handle focus management when dialog opens/closes
    React.useEffect(() => {
      if (!open) return;
      
      // Store current active element
      const previousActiveElement = document.activeElement as HTMLElement;
      
      // Focus first focusable element in dialog
      requestAnimationFrame(() => {
        if (dialogRef.current) {
          const focusableElements = getFocusableElements(dialogRef.current);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            // If no focusable elements, focus the dialog itself
            dialogRef.current.focus();
          }
        }
      });
      
      // Return focus on close
      return () => {
        if (triggerRef?.current) {
          triggerRef.current.focus();
        } else if (previousActiveElement && previousActiveElement.focus) {
          previousActiveElement.focus();
        }
      };
    }, [open, triggerRef]);
    
    // Handle keyboard events (Escape to close)
    React.useEffect(() => {
      if (!open || !dialogRef.current) return;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onOpenChange(false);
        }
      };
      
      // Focus trap management
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== "Tab" || !dialogRef.current) return;
        
        const focusableElements = getFocusableElements(dialogRef.current);
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // If shift+tab on first element, move to last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        
        // If tab on last element, move to first element
        if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      };
      
      dialogRef.current.addEventListener("keydown", handleKeyDown);
      dialogRef.current.addEventListener("keydown", handleTabKey);
      
      return () => {
        dialogRef.current?.removeEventListener("keydown", handleKeyDown);
        dialogRef.current?.removeEventListener("keydown", handleTabKey);
      };
    }, [open, onOpenChange]);
    
    // Handle click outside to close
    const handleOutsideClick = React.useCallback(
      (e: React.MouseEvent) => {
        if (
          dialogRef.current &&
          e.target instanceof Node &&
          !dialogRef.current.contains(e.target)
        ) {
          onOpenChange(false);
        }
      },
      [onOpenChange]
    );
    
    // Don't render anything if dialog is closed
    if (!open) return null;
    
    return (
      <div
        role="presentation"
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto"
        onClick={handleOutsideClick}
      >
        {/* Modal backdrop */}
        {modal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            aria-hidden="true"
          />
        )}
        
        {/* Dialog container */}
        <div
          ref={combinedRef}
          role="dialog"
          aria-modal={modal}
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1} // Make dialog focusable but not in tab order
          className="relative z-[101] w-full max-w-md overflow-auto rounded-md bg-background p-6 shadow-lg focus:outline-none"
          {...props}
        >
          {/* Hidden but accessible title */}
          <div id={titleId} className="sr-only">
            {title}
          </div>
          
          {/* Hidden but accessible description */}
          {description && (
            <div id={descriptionId} className="sr-only">
              {description}
            </div>
          )}
          
          {children}
        </div>
      </div>
    );
  }
);
DialogPrimitive.displayName = "DialogPrimitive";

export interface AlertDialogPrimitiveProps extends Omit<DialogPrimitiveProps, "role"> {
  /**
   * Severity of the alert
   */
  severity?: "info" | "warning" | "danger";
}

/**
 * Alert dialog primitive for important messages requiring user attention
 */
export const AlertDialogPrimitive = React.forwardRef<HTMLDivElement, AlertDialogPrimitiveProps>(
  ({ severity = "info", ...props }, ref) => {
    return (
      <DialogPrimitive
        ref={ref}
        modal={true} // Alert dialogs should always be modal
        {...props}
      />
    );
  }
);
AlertDialogPrimitive.displayName = "AlertDialogPrimitive";

export interface DialogTitlePrimitiveProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * HTML heading level (h1-h6)
   * @default 'h2'
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * Dialog title primitive component
 */
export const DialogTitlePrimitive = React.forwardRef<
  HTMLHeadingElement,
  DialogTitlePrimitiveProps
>(({ className, as: Component = "h2", ...props }, ref) => {
  return <Component ref={ref} className={className} {...props} />;
});
DialogTitlePrimitive.displayName = "DialogTitlePrimitive";

export interface DialogDescriptionPrimitiveProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * Dialog description primitive component
 */
export const DialogDescriptionPrimitive = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionPrimitiveProps
>(({ className, ...props }, ref) => {
  return <p ref={ref} className={className} {...props} />;
});
DialogDescriptionPrimitive.displayName = "DialogDescriptionPrimitive";

export interface DialogContentPrimitiveProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Dialog content primitive component
 */
export const DialogContentPrimitive = React.forwardRef<
  HTMLDivElement,
  DialogContentPrimitiveProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />;
});
DialogContentPrimitive.displayName = "DialogContentPrimitive";

export interface DialogFooterPrimitiveProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Dialog footer primitive component
 */
export const DialogFooterPrimitive = React.forwardRef<
  HTMLDivElement,
  DialogFooterPrimitiveProps
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={className} {...props} />;
});
DialogFooterPrimitive.displayName = "DialogFooterPrimitive";

export interface DialogClosePrimitiveProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Dialog close button primitive component
 */
export const DialogClosePrimitive = React.forwardRef<
  HTMLButtonElement,
  DialogClosePrimitiveProps
>(({ className, ...props }, ref) => {
  return <button ref={ref} type="button" className={className} {...props} />;
});
DialogClosePrimitive.displayName = "DialogClosePrimitive"; 