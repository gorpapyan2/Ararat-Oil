import * as React from "react";
import { Link } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils";
import { Slot } from "@radix-ui/react-slot";

/**
 * Props for the ButtonPrimitive component.
 * This is the basic button without styling.
 */
export interface ButtonPrimitiveProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Forward ref to the root button element
   */
  ref?: React.ForwardedRef<HTMLButtonElement>;
}

/**
 * Base primitive Button component
 * Handles basic button functionality without styling
 */
export const ButtonPrimitive = React.forwardRef<HTMLButtonElement, ButtonPrimitiveProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={className} {...props} />;
  }
);
ButtonPrimitive.displayName = "ButtonPrimitive";

/**
 * Props for the AnchorButtonPrimitive component.
 * This is for link elements that should look like buttons.
 */
export interface AnchorButtonPrimitiveProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Forward ref to the root anchor element
   */
  ref?: React.ForwardedRef<HTMLAnchorElement>;
}

/**
 * Base primitive Anchor Button component
 * For creating anchor links styled as buttons
 */
export const AnchorButtonPrimitive = React.forwardRef<HTMLAnchorElement, AnchorButtonPrimitiveProps>(
  ({ className, ...props }, ref) => {
    return <a ref={ref} className={className} {...props} />;
  }
);
AnchorButtonPrimitive.displayName = "AnchorButtonPrimitive";

/**
 * Props for the LoadingSpinnerPrimitive component.
 */
export interface LoadingSpinnerPrimitiveProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Forward ref to the root spinner element
   */
  ref?: React.ForwardedRef<HTMLDivElement>;
}

/**
 * Base primitive Loading Spinner component for buttons
 */
export const LoadingSpinnerPrimitive = React.forwardRef<HTMLDivElement, LoadingSpinnerPrimitiveProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={className}
        {...props}
      />
    );
  }
);
LoadingSpinnerPrimitive.displayName = "LoadingSpinnerPrimitive";

/**
 * Button variants using class-variance-authority
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-gray-50 hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Button component with styling variants
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

/**
 * Button Link component - behaves like a button but navigates like a link
 */
export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  to: string;
  disabled?: boolean;
}

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, to, variant, size, disabled, ...props }, ref) => {
    return (
      <Link
        to={to}
        className={cn(
          buttonVariants({ variant, size, className }),
          disabled && "pointer-events-none opacity-50"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
ButtonLink.displayName = "ButtonLink";

export { buttonVariants }; 