import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonPrimitive, AnchorButtonPrimitive } from "@/components/ui/primitives/button";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";

/**
 * Button variants with consistent styling across the application
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      /**
       * Visual style variants
       */
      variant: {
        /** Primary action buttons - use for the main action in a form or section */
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        
        /** Dangerous action buttons - use for destructive actions like delete */
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        
        /** Subtle buttons with borders - use for secondary actions */
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        
        /** Alternative emphasis - use for secondary but still important actions */
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        
        /** Minimal emphasis - use for actions in toolbars or with space constraints */
        ghost: "hover:bg-accent hover:text-accent-foreground",
        
        /** Text link styled as button - use for navigation actions */
        link: "text-primary underline-offset-4 hover:underline",
        
        /** Alternative style - use for featured or promotional actions */
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 border border-accent/20",
      },
      
      /**
       * Size variants
       */
      size: {
        /** Default size suitable for most contexts */
        default: "h-10 px-4 py-2",
        
        /** Smaller size for compact UIs */
        sm: "h-9 rounded-md px-3",
        
        /** Larger size for emphasis or touch interfaces */
        lg: "h-11 rounded-md px-8",
        
        /** Square shape for icon-only buttons */
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Whether the button should render as a child component
   * @default false
   */
  asChild?: boolean;

  /**
   * Icon to display within the button (start position)
   */
  startIcon?: React.ReactNode;

  /**
   * Icon to display within the button (end position)
   */
  endIcon?: React.ReactNode;

  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Text to display when in loading state
   * If not provided, the button's children will still be shown
   */
  loadingText?: string;
}

/**
 * Base Button component with enhanced accessibility and styling
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    startIcon, 
    endIcon,
    isLoading = false,
    loadingText,
    children,
    disabled,
    ...props 
  }, ref) => {
    // Use a regular button element
    return (
      <ButtonPrimitive
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <Spinner 
            className="mr-2 h-4 w-4" 
            size="sm" 
            useCurrentColor={true} 
            aria-hidden="true"
          />
        )}
        {!isLoading && startIcon && (
          <span className="mr-2 flex-shrink-0">{startIcon}</span>
        )}
        {isLoading && loadingText ? loadingText : children}
        {endIcon && (
          <span className="ml-2 flex-shrink-0">{endIcon}</span>
        )}
      </ButtonPrimitive>
    );
  },
);
Button.displayName = "Button";

/**
 * Props for ButtonLink component
 */
export interface ButtonLinkProps 
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof buttonVariants> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  href: string;
}

/**
 * ButtonLink component - For anchor links styled as buttons
 */
const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ 
    className, 
    variant, 
    size, 
    startIcon, 
    endIcon,
    children,
    href,
    ...props 
  }, ref) => {
    return (
      <Link
        to={href}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {startIcon && (
          <span className="mr-2 flex-shrink-0">{startIcon}</span>
        )}
        {children}
        {endIcon && (
          <span className="ml-2 flex-shrink-0">{endIcon}</span>
        )}
      </Link>
    );
  }
);
ButtonLink.displayName = "ButtonLink";

export { Button, ButtonLink, buttonVariants };
