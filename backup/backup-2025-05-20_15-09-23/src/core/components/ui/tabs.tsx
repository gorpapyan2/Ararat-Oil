import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
  {
    variants: {
      size: {
        sm: "h-9 text-xs",
        md: "h-10 text-sm",
        lg: "h-11 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
      variant: {
        default: "bg-muted",
        outline: "bg-transparent border border-input",
        pills: "bg-transparent gap-1",
        underline: "bg-transparent border-b border-input p-0 rounded-none",
      },
    },
    defaultVariants: {
      size: "md",
      fullWidth: false,
      variant: "default",
    },
  }
);

export interface TabsListProps 
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, size, fullWidth, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, size, fullWidth }), className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        outline: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        pills: "rounded-md hover:bg-muted/50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        underline: "rounded-none border-b-2 border-b-transparent px-4 pb-3 pt-2 data-[state=active]:border-b-primary data-[state=active]:text-foreground shadow-none hover:text-foreground",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base px-4 py-2",
      },
      fullWidth: {
        true: "flex-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface TabsTriggerProps 
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  /**
   * Icon to display before the trigger text
   */
  icon?: React.ReactNode;
  
  /**
   * Badge or indicator to display after the trigger text
   */
  badge?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, fullWidth, icon, badge, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size, fullWidth }), className)}
    {...props}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
    {badge && <span className="ml-2">{badge}</span>}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

/**
 * Tabs interface for organizing content in different sections
 * 
 * @example
 * ```tsx
 * <Tabs defaultValue="account">
 *   <TabsList>
 *     <TabsTrigger value="account">Account</TabsTrigger>
 *     <TabsTrigger value="password">Password</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">Account settings...</TabsContent>
 *   <TabsContent value="password">Password settings...</TabsContent>
 * </Tabs>
 * ```
 */
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
};
