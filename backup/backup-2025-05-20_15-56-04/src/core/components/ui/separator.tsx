import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/utils/cn';

/**
 * Separator component props
 */
export interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /**
   * Optional decorator for the separator
   */
  decorator?: React.ReactNode;
  
  /**
   * Add text label to the separator
   */
  label?: string;
}

/**
 * Separator component that visually or semantically separates content
 * 
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * <Separator label="OR" />
 * ```
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ 
  className, 
  orientation = "horizontal", 
  decorative = true, 
  decorator,
  label,
  ...props 
}, ref) => {
  // If there's a label or decorator, use a more complex layout
  if (label || decorator) {
    return (
      <div 
        className={cn(
          "flex items-center",
          orientation === "horizontal" ? "w-full" : "flex-col h-full",
          className
        )}
      >
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn(
            "shrink-0 bg-border",
            orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
          )}
          {...props}
        />
        
        {label && (
          <div className={cn(
            "flex items-center justify-center text-xs text-muted-foreground",
            orientation === "horizontal" 
              ? "mx-2 absolute left-1/2 -translate-x-1/2 px-2 bg-background" 
              : "my-2 rotate-90"
          )}>
            {label}
          </div>
        )}
        
        {decorator && !label && (
          <div className={cn(
            orientation === "horizontal" 
              ? "mx-2 absolute left-1/2 -translate-x-1/2"
              : "my-2"
          )}>
            {decorator}
          </div>
        )}
      </div>
    );
  }
  
  // Basic separator
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  );
});

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
