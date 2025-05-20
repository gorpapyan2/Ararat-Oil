import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/utils/cn';

/**
 * Badge variants for different visual styles
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/80",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[0.625rem]",
        lg: "px-3 py-0.5 text-sm",
      },
      shape: {
        default: "rounded-full",
        rounded: "rounded-md",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
);

export interface BadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Makes the badge dismissible with an X button
   */
  dismissible?: boolean;
  
  /**
   * Function called when the dismiss button is clicked
   */
  onDismiss?: () => void;
  
  /**
   * Optional icon to display before the badge text
   */
  icon?: React.ReactNode;
  
  /**
   * Displays a dot indicator
   */
  dot?: boolean;
  
  /**
   * Color of the dot indicator (when dot is true)
   */
  dotColor?: string;
  
  /**
   * Number to display as a counter. Will be capped at 99+
   */
  count?: number;
}

/**
 * Badge component for displaying status, count, or categorical information
 * 
 * @example
 * ```tsx
 * <Badge>Default</Badge>
 * <Badge variant="destructive">Destructive</Badge>
 * <Badge variant="outline">Outline</Badge>
 * <Badge icon={<CheckIcon />}>With icon</Badge>
 * <Badge count={5}>Notifications</Badge>
 * <Badge dismissible onDismiss={() => console.log('dismissed')}>Dismissible</Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size,
    shape,
    dismissible,
    onDismiss,
    icon,
    dot,
    dotColor = "bg-primary",
    count,
    children,
    ...props 
  }, ref) => {
    // Format count to cap at 99+
    const formattedCount = count !== undefined 
      ? count > 99 
        ? '99+' 
        : count.toString() 
      : undefined;
      
    const handleDismiss = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDismiss?.();
    };
    
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, shape }), className)}
        {...props}
      >
        {dot && (
          <span 
            className={cn("mr-1 h-1.5 w-1.5 rounded-full", dotColor)} 
            aria-hidden="true"
          />
        )}
        
        {icon && <span className="mr-1">{icon}</span>}
        
        {formattedCount !== undefined ? (
          <span>{formattedCount}</span>
        ) : (
          children
        )}
        
        {dismissible && (
          <button 
            type="button" 
            className="ml-1 -mr-1 h-3.5 w-3.5 rounded-full hover:bg-muted/20" 
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
