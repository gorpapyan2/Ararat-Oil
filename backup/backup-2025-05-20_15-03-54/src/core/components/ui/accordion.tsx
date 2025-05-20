import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const Accordion = AccordionPrimitive.Root;

const accordionItemVariants = cva('', {
  variants: {
    variant: {
      default: 'border-b',
      bordered: 'border rounded-md mb-2',
      separated: 'mb-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    VariantProps<typeof accordionItemVariants> {}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ variant }), className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const accordionTriggerVariants = cva(
  'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'px-4',
        separated: 'px-4 border rounded-md bg-background',
      },
      size: {
        sm: 'text-sm py-2',
        md: 'text-base py-4',
        lg: 'text-lg py-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    VariantProps<typeof accordionTriggerVariants> {
  /**
   * Custom icon to display instead of the default chevron
   */
  icon?: React.ReactNode;
  
  /**
   * Whether to hide the chevron/icon
   */
  hideIcon?: boolean;
}

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, variant, size, icon, hideIcon = false, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(accordionTriggerVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {!hideIcon && (
        <div className="shrink-0 transition-transform duration-200">
          {icon || <ChevronDown className="h-4 w-4" />}
        </div>
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const accordionContentVariants = cva(
  'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'px-4 pb-4',
        separated: 'mt-2 rounded-md border px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    VariantProps<typeof accordionContentVariants> {}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, variant, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(accordionContentVariants({ variant }), className)}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

/**
 * Compound component for displaying collapsible content sections
 * 
 * @example
 * ```tsx
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>Content for section 1</AccordionContent>
 *   </AccordionItem>
 *   <AccordionItem value="item-2">
 *     <AccordionTrigger>Section 2</AccordionTrigger>
 *     <AccordionContent>Content for section 2</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};
