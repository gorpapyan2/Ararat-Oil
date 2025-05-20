import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from '@/utils/cn';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipContentVariants = cva(
  "z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-popover text-popover-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        muted: "bg-muted text-muted-foreground",
        info: "bg-info text-info-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
      },
      size: {
        default: "px-3 py-1.5 text-sm",
        sm: "px-2 py-1 text-xs",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TooltipContentProps 
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipContentVariants> {
  /**
   * Adds an arrow to the tooltip
   */
  withArrow?: boolean;
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ 
  className, 
  variant,
  size,
  withArrow = false,
  sideOffset = 4,
  ...props 
}, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipContentVariants({ variant, size }), className)}
    {...props}
  >
    {withArrow && <TooltipPrimitive.Arrow className="fill-current" width={8} height={4} />}
    {props.children}
  </TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

/**
 * A simple component that combines all tooltip parts into one easy-to-use component
 */
interface SimpleTooltipProps extends Omit<TooltipContentProps, 'children'> {
  /**
   * The content to display in the tooltip
   */
  content: string;
  
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactNode;
  
  /**
   * The side of the trigger to place the tooltip
   * @default "top"
   */
  side?: "top" | "right" | "bottom" | "left";
  
  /**
   * The alignment of the tooltip
   */
  align?: "start" | "center" | "end";
  
  /**
   * Delay in milliseconds before showing the tooltip
   * @default 0
   */
  delayDuration?: number;
  
  /**
   * Skip the delay when showing the tooltip
   * @default false
   */
  skipDelayDuration?: boolean;
  
  /**
   * Whether the tooltip is disabled
   * @default false
   */
  disabled?: boolean;
}

const SimpleTooltip = ({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 0,
  disabled = false,
  withArrow = false,
  variant,
  size,
  className,
  ...props
}: SimpleTooltipProps) => {
  // Don't render the tooltip if it's disabled
  if (disabled) {
    return <>{children}</>;
  }
  
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        withArrow={withArrow}
        variant={variant}
        size={size}
        className={className}
        {...props}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
};
SimpleTooltip.displayName = "SimpleTooltip";

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip
};
