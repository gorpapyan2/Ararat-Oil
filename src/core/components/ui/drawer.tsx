import * as React from "react";
import { cn } from "@/shared/utils";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "./button";

const drawerVariants = cva(
  "fixed z-50 bg-background shadow-lg transition-transform duration-300 ease-in-out",
  {
    variants: {
      position: {
        top: "inset-x-0 top-0 border-b h-[var(--drawer-height,20rem)] translate-y-0",
        bottom:
          "inset-x-0 bottom-0 border-t h-[var(--drawer-height,20rem)] translate-y-0",
        left: "inset-y-0 left-0 border-r w-[var(--drawer-width,30rem)] translate-x-0",
        right:
          "inset-y-0 right-0 border-l w-[var(--drawer-width,30rem)] translate-x-0",
      },
    },
    defaultVariants: {
      position: "right",
    },
  }
);

export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnClickOutside?: boolean;
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      className,
      position,
      open,
      onOpenChange,
      closeOnClickOutside = true,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(open);

    React.useEffect(() => {
      setIsOpen(open);
    }, [open]);

    React.useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          setIsOpen(false);
          onOpenChange?.(false);
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (closeOnClickOutside && isOpen) {
          const drawerEl = document.getElementById("drawer-content");
          if (drawerEl && !drawerEl.contains(e.target as Node)) {
            setIsOpen(false);
            onOpenChange?.(false);
          }
        }
      };

      document.addEventListener("keydown", handleEsc);
      if (closeOnClickOutside) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("keydown", handleEsc);
        if (closeOnClickOutside) {
          document.removeEventListener("mousedown", handleClickOutside);
        }
      };
    }, [isOpen, onOpenChange, closeOnClickOutside]);

    // Add overflow hidden to body when drawer is open
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    const positionStyles = {
      top: "translate-y-[-100%]",
      bottom: "translate-y-[100%]",
      left: "translate-x-[-100%]",
      right: "translate-x-[100%]",
    };

    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-black/50" aria-hidden="true" />
        )}
        <div
          className={cn(
            drawerVariants({ position }),
            isOpen ? "" : positionStyles[position || "right"],
            className
          )}
          ref={ref}
          id="drawer-content"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);
Drawer.displayName = "Drawer";

const DrawerTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => (
  <button ref={ref} {...props}>
    {children}
  </button>
));
DrawerTrigger.displayName = "DrawerTrigger";

const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn("absolute right-4 top-4", className)}
    ref={ref}
    {...props}
  >
    <X className="h-4 w-4" aria-hidden="true" />
    <span className="sr-only">Close</span>
  </Button>
));
DrawerClose.displayName = "DrawerClose";

const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 overflow-auto h-full", className)}
    {...props}
  >
    {children}
  </div>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 pb-4", className)}
    {...props}
  />
));
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4",
      className
    )}
    {...props}
  />
));
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
