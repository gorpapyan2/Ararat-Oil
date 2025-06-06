/**
 * Button Component
 *
 * Base button component that serves as the foundation for all other button variants.
 * Built on class-variance-authority for variant handling.
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from 'class-variance-authority';
import { cn } from "@/shared/utils";

/**
 * Tailwind classes for all button variants and sizes with natural color palette
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        // Primary button with natural gray color
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-sm hover:shadow-md",
        
        // Secondary button with straw accent
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-[1.02] shadow-sm hover:shadow-md",
        
        // Natural gradient button
        natural: "bg-gradient-natural text-white hover:bg-gradient-natural-dark hover:scale-[1.02] shadow-sm hover:shadow-md",
        
        // Accent button with straw color
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-[1.02] shadow-sm hover:shadow-md",
        
        // Destructive with enhanced styling
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02] shadow-sm hover:shadow-md",
        
        // Enhanced outline with natural borders
        outline: "border border-border bg-background hover:bg-gradient-natural-light hover:text-foreground hover:border-accent/20 hover:scale-[1.01]",
        
        // Enhanced ghost with natural hover
        ghost: "hover:bg-gradient-natural-light hover:text-foreground hover:scale-[1.01]",
        
        // Link variant with accent color
        link: "text-primary underline-offset-4 hover:underline hover:text-accent transition-colors",
        
        // Glassmorphism variant
        glass: "bg-white/10 backdrop-blur-sm border border-white/20 text-foreground hover:bg-white/20 hover:scale-[1.02]",
        
        // Gradient variants
        "gradient-primary": "bg-gradient-corporate text-white hover:opacity-90 hover:scale-[1.02] shadow-md hover:shadow-lg",
        "gradient-energy": "bg-gradient-energy text-white hover:opacity-90 hover:scale-[1.02] shadow-md hover:shadow-lg",
        "gradient-fuel": "bg-gradient-fuel text-white hover:opacity-90 hover:scale-[1.02] shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Button component props interface
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Whether to render the button as a child slot
   * Useful when you want the button's functionality but not its default styling
   */
  asChild?: boolean;
  
  /**
   * Whether to show a loading state
   */
  loading?: boolean;
  
  /**
   * Icon to display before the button text
   */
  icon?: React.ReactNode;
  
  /**
   * Icon to display after the button text
   */
  rightIcon?: React.ReactNode;
}

/**
 * Base Button component
 *
 * This serves as the foundation for all other button variants in the application.
 * It supports various sizes, variants, and can be used as a slot.
 *
 * @example
 * ```tsx
 * <Button>Default Button</Button>
 * <Button variant="destructive" size="lg">Delete</Button>
 * <Button variant="outline" size="sm">Cancel</Button>
 * <Button variant="natural">Natural Style</Button>
 * <Button variant="gradient-primary">Gradient Button</Button>
 * <Button asChild><Link href="/somewhere">Navigate</Link></Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, rightIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {/* Shimmer effect for enhanced buttons */}
        {(variant === "gradient-primary" || variant === "gradient-energy" || variant === "gradient-fuel") && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
        
        {/* Button content */}
        <div className="relative flex items-center justify-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          {!loading && icon && icon}
          {children}
          {!loading && rightIcon && rightIcon}
        </div>
      </Comp>
    );
  }
);

Button.displayName = "Button";
