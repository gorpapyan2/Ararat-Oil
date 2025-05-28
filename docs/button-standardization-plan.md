# Button Component Standardization Plan

## Current State

The codebase currently has multiple button component implementations across different files:
1. `button.tsx` - Basic button component
2. `action-button.tsx` - Action-specific button
3. `create-button.tsx` - Button specifically for creation actions
4. `icon-button.tsx` - Button with icon support
5. `loading-button.tsx` - Button with loading states
6. `button-group.tsx` - Button grouping component
7. `toggle-button.tsx` - Button with toggle functionality
8. `toggle-button-group.tsx` - Group for toggle buttons

This fragmentation creates several issues:
- Inconsistent props and behavior across button variants
- Duplicated styling logic
- No clear guidance on when to use which button component
- Inefficient composition patterns requiring more code than necessary
- Unnecessary re-implementation of similar functionality

## Standardization Strategy

We will follow a similar approach to the successful card standardization:

1. Create a unified button component system that:
   - Has a consistent API across all button variants
   - Follows a clear component hierarchy
   - Minimizes code duplication
   - Provides strong TypeScript typing
   - Ensures accessibility by default

2. Key components to include:
   - Base `Button` component
   - Specialized variants: `ActionButton`, `IconButton`, `LoadingButton`
   - Composition helpers: `ButtonGroup`, `ToggleButtonGroup`
   - Higher-level components: `CreateButton`, `DeleteButton`, `SubmitButton`

## Implementation Plan

### 1. Directory Structure

Create a dedicated directory for the button components:

```
src/
  core/
    components/
      ui/
        buttons/
          button.tsx       # Base button component
          icon-button.tsx  # Icon button component
          loading-button.tsx # Button with loading state
          action-button.tsx # Button for specific actions
          button-group.tsx # Button grouping component
          toggle-button.tsx # Toggle button component
          toggle-group.tsx # Toggle button group
          types.ts        # Shared types and interfaces
          index.ts        # Re-exports all button components
        buttons.tsx       # Backward compatibility file
```

### 2. Base Button Component

Refine the base `Button` component to serve as the foundation:

```tsx
// buttons/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import { ButtonBaseProps } from "./types";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps 
  extends ButtonBaseProps, 
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

### 3. Specialized Button Components

Build specialized button components on top of the base button:

#### Icon Button

```tsx
// buttons/icon-button.tsx
import * as React from "react";
import { cn } from "@/utils";
import { Button, ButtonProps } from "./button";

export interface IconButtonProps extends Omit<ButtonProps, "size"> {
  icon: React.ReactNode;
  label?: string; // Accessible label
  size?: "sm" | "default" | "lg";
  iconPosition?: "start" | "end";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    icon, 
    label,
    children, 
    className,
    size = "default",
    iconPosition = "start", 
    ...props 
  }, ref) => {
    // Map sizes to button component sizes
    const buttonSize = size === "icon" ? "icon" : size;
    
    return (
      <Button
        ref={ref}
        size={buttonSize}
        className={cn(
          children ? "gap-2" : "",
          className
        )}
        aria-label={children ? undefined : label}
        {...props}
      >
        {iconPosition === "start" && icon}
        {children}
        {iconPosition === "end" && icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
```

#### Loading Button

```tsx
// buttons/loading-button.tsx
import * as React from "react";
import { cn } from "@/utils";
import { Button, ButtonProps } from "./button";
import { Spinner } from "../spinner";

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  spinnerClassName?: string;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    isLoading, 
    loadingText, 
    children, 
    className, 
    spinnerClassName,
    disabled,
    ...props 
  }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner className={cn("mr-2 h-4 w-4", spinnerClassName)} />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
```

### 4. Shared Type Definitions

Create a shared types file:

```tsx
// buttons/types.ts
import * as React from "react";

// Base button props - common to all button components
export interface ButtonBaseProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Additional common props
}

// Type for button color variants
export type ButtonColorVariant = 
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

// Type for button size variants
export type ButtonSizeVariant = 
  | "default"
  | "sm"
  | "lg"
  | "icon";

// Type for button icon positions
export type ButtonIconPosition = "start" | "end";
```

### 5. Re-export All Button Components

Create an index.ts file to re-export all button components:

```tsx
// buttons/index.ts
export * from "./button";
export * from "./icon-button";
export * from "./loading-button";
export * from "./action-button";
export * from "./button-group";
export * from "./toggle-button"; 
export * from "./toggle-group";
export * from "./types";
```

### 6. Backward Compatibility

Create a backward compatibility file:

```tsx
// buttons.tsx
/**
 * @deprecated Import from "@/core/components/ui/buttons" instead
 * This file is maintained for backward compatibility
 */

// Direct re-export from the buttons directory
export * from "./buttons/index";
```

## Migration Strategy

1. **Phase 1: Implementation**
   - Create the new button components directory
   - Implement the base Button component
   - Implement specialized button components
   - Create shared types and re-export file

2. **Phase 2: Pilot Usage**
   - Update 2-3 key components to use the new button system
   - Gather feedback and make adjustments
   - Document usage patterns

3. **Phase 3: Full Migration**
   - Create a migration script to help identify usage of old button components
   - Update remaining usage throughout the codebase
   - Add deprecation notices to old implementations

4. **Phase 4: Cleanup**
   - Remove deprecated implementations after transition period
   - Update documentation
   - Create additional variants as needed

## Testing Strategy

1. **Unit Tests**
   - Test rendering of all button variants
   - Test accessibility properties
   - Test interaction behavior (click, focus, etc.)

2. **Component Tests**
   - Test button components in the context of forms and UI workflows
   - Test loading and disabled states
   - Test keyboard navigation and screen reader compatibility

3. **Accessibility Tests**
   - Verify proper ARIA attributes
   - Check keyboard navigation
   - Test screen reader announcements

## Documentation

1. **Component API Documentation**
   - Document all props and variants
   - Provide usage examples for common scenarios
   - Include accessibility considerations

2. **Migration Guide**
   - Document how to migrate from old to new button components
   - Include code examples

## Benefits

1. **Reduced Duplication**: All button variants share common code and styles
2. **Improved Consistency**: Buttons behave predictably across the application
3. **Better Accessibility**: Built-in accessibility features in all button components
4. **Type Safety**: Comprehensive TypeScript typing for all button props
5. **Simpler Development**: Clear guidance on which button component to use
6. **Maintainability**: Changes can be made in one place and propagate across the app

## Timeline

- **Planning & Design**: 1 day
- **Implementation**: 2 days
- **Testing**: 1 day
- **Documentation**: 1 day
- **Migration**: 2-3 days (incremental)

Total: 7-8 days 