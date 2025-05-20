import * as React from "react";
import { cn } from "@/shared/utils";
import { buttonVariants } from '@/core/components/ui/button';
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Props for the ButtonGroup component
 */
export interface ButtonGroupProps extends 
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof buttonGroupVariants> {
  /**
   * The content of the button group
   */
  children: React.ReactNode;
  
  /**
   * Orientation of the button group (horizontal or vertical)
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  
  /**
   * Whether the buttons should be attached to each other
   * @default false
   */
  attached?: boolean;
  
  /**
   * Size of the buttons in the group
   * @default "default"
   */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * ButtonGroup variants
 */
const buttonGroupVariants = cva("inline-flex", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    attached: {
      true: "",
      false: "gap-2",
    },
    size: {
      default: "",
      sm: "",
      lg: "", 
      icon: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    attached: false,
    size: "default",
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      attached: true,
      class: [
        "[&>*:not(:first-child)]:rounded-l-none",
        "[&>*:not(:last-child)]:rounded-r-none",
        "[&>*:not(:first-child)]:border-l-0",
      ],
    },
    {
      orientation: "vertical",
      attached: true,
      class: [
        "[&>*:not(:first-child)]:rounded-t-none",
        "[&>*:not(:last-child)]:rounded-b-none",
        "[&>*:not(:first-child)]:border-t-0",
      ],
    },
  ],
});

/**
 * ButtonGroup component for grouping related buttons
 * 
 * Useful for creating toolbars or action groups with consistent styling
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ 
    className, 
    orientation = "horizontal",
    attached = false,
    size = "default",
    children,
    ...props 
  }, ref) => {
    // Clone each child to pass the size prop if it's a button
    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && 
          (child.type as any)?.displayName?.includes('Button')) {
        return React.cloneElement(child, { 
          size: size,
          className: cn(
            child.props.className,
            attached && "focus:relative focus:z-10" // Ensure focused button is visible
          ),
          ...child.props 
        });
      }
      return child;
    });
    
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          buttonGroupVariants({ 
            orientation, 
            attached, 
            size,
            className 
          })
        )}
        {...props}
      >
        {childrenWithProps}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup"; 