import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '@/shared/utils';

export interface CommandProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  // Add specific props here
}

/**
 * Command component - a searchable command palette
 */
export function Command({ className, ...props }: CommandProps) {
  return (
    <CommandPrimitive
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        className
      )}
      {...props}
    />
  );
}

interface CommandGroupProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> {}

/**
 * Command group component for grouping command items
 */
export function CommandGroup({ className, ...props }: CommandGroupProps) {
  return (
    <CommandPrimitive.Group
      className={cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        className
      )}
      {...props}
    />
  );
}

interface CommandItemProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> {}

/**
 * Command item component for individual selectable items
 */
export function CommandItem({ className, ...props }: CommandItemProps) {
  return (
    <CommandPrimitive.Item
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    />
  );
}

// Additional components can be exported here as needed
export const CommandInput = CommandPrimitive.Input;
export const CommandList = CommandPrimitive.List;
export const CommandEmpty = CommandPrimitive.Empty;
export const CommandSeparator = CommandPrimitive.Separator;
