import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/utils/cn';

/**
 * Popover Root component
 */
const Popover = PopoverPrimitive.Root;

/**
 * Popover Trigger component that opens the popover
 */
const PopoverTrigger = PopoverPrimitive.Trigger;

/**
 * Popover Anchor - alternative to Trigger, allows separate positioning
 */
const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * Popover Content component
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ 
  className, 
  align = "center", 
  sideOffset = 4, 
  alignOffset = 0,
  children,
  ...props 
}, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      {children}
      <PopoverPrimitive.Arrow className="fill-popover" />
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

/**
 * Popover Close button component
 */
const PopoverClose = PopoverPrimitive.Close;

/**
 * Popover components with additional helpers
 * 
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger>Open Popover</PopoverTrigger>
 *   <PopoverContent>Popover content</PopoverContent>
 * </Popover>
 * ```
 */
const PopoverRoot = Object.assign(Popover, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Anchor: PopoverAnchor,
  Close: PopoverClose,
});

export { 
  PopoverRoot as Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose 
};
