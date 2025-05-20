import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

/**
 * Label variants with different visual styles
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-destructive",
      },
      disabled: {
        true: "opacity-70 cursor-not-allowed",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Label component props
 */
export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /**
   * Shows a tooltip when hovering over the label
   */
  tooltip?: string;
  
  /**
   * Shows the field as required with a red asterisk
   */
  required?: boolean;
  
  /**
   * ID of the form element this label is associated with
   */
  htmlFor?: string;
}

/**
 * Label component for form elements
 * 
 * @example
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * <Label htmlFor="password" required>Password</Label>
 * ```
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ 
  className, 
  size, 
  required,
  disabled,
  tooltip,
  children, 
  ...props 
}, ref) => {
  const labelComponent = (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants({ size, required, disabled }), className)}
      {...props}
    >
      {children}
    </LabelPrimitive.Root>
  );

  // Add tooltip if provided
  if (tooltip) {
    return (
      <div className="relative inline-block group">
        {labelComponent}
        <span className="absolute z-10 hidden group-hover:inline-block bg-black text-white text-xs rounded py-1 px-2 -mt-1 ml-2 opacity-90">
          {tooltip}
        </span>
      </div>
    );
  }

  return labelComponent;
});

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
