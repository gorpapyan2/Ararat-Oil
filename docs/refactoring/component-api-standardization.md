# Component API Standardization Guide

This guide outlines our standards and best practices for component APIs across the codebase. Following these guidelines ensures consistency, maintainability, and better developer experience.

## Table of Contents

1. [Component Structure](#component-structure)
2. [Naming Conventions](#naming-conventions)
3. [Props Patterns](#props-patterns)
4. [Event Handling](#event-handling)
5. [Composition Patterns](#composition-patterns)
6. [Accessibility](#accessibility)
7. [Performance Considerations](#performance-considerations)
8. [Documentation](#documentation)

## Component Structure

### File Organization

Each component should follow this structure:

```tsx
// 1. Imports
import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/core/components/ui/primitives/button';

// 2. Types
export interface ComponentNameProps {
  // Props definition
}

// 3. Component
export function ComponentName({ prop1, prop2, className }: ComponentNameProps) {
  // Hooks
  const { t } = useTranslation();
  
  // State and derived values
  
  // Event handlers
  
  // Effects
  
  // Render
  return (
    <div className={cn('base-styles', className)}>
      {/* Component content */}
    </div>
  );
}
```

### Export Pattern

- Always use named exports for components: `export function ComponentName`
- Export types and interfaces with the component
- Don't use default exports except for page components

## Naming Conventions

### Components

- Use PascalCase for component names: `UserProfile`, `DataTable`
- Be descriptive and specific: `ExpenseForm` instead of just `Form`
- Use consistent suffixes:
  - `Form` for form components
  - `List` for lists
  - `Item` for individual items in a list
  - `Card` for card-based components
  - `Dialog` for dialog components

### Props

- Use camelCase for prop names: `onClick`, `initialValue`
- Boolean props should use positive names with "is", "has", or "should" prefixes:
  - `isDisabled` instead of `disabled`
  - `hasError` instead of `error`
  - `shouldValidate` instead of `validate`
- Event handler props should start with "on": `onClick`, `onSubmit`

## Props Patterns

### Consistent Props Interface

- Always define a props interface for each component
- Export the interface with the same name as the component plus "Props" suffix
- Include JSDoc comments for each prop

```tsx
/**
 * Form component for editing user profile information
 */
export interface ProfileFormProps {
  /** Initial user data to populate the form */
  initialData?: UserProfile;
  /** Called when the form is submitted with valid data */
  onSubmit: (data: UserProfile) => void;
  /** Called when the form is cancelled */
  onCancel?: () => void;
  /** Whether the form is currently submitting */
  isSubmitting?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional CSS class names */
  className?: string;
}
```

### Common Props

Include these common props in components where applicable:

- `className`: For styling customization
- `id`: For explicit element ID when needed
- `children`: For composition
- `disabled` or `isDisabled`: For disabling interaction
- `aria-*`: For accessibility properties

### Default Props

- Use default parameter values instead of defaultProps:

```tsx
// Good
function Component({ isOpen = false, title = 'Default' }) {
  // ...
}

// Avoid
function Component(props) {
  // ...
}
Component.defaultProps = {
  isOpen: false,
  title: 'Default'
};
```

## Event Handling

### Handler Naming

- Internal handlers should be named with "handle" prefix: `handleClick`
- Props for external handlers should be named with "on" prefix: `onClick`

```tsx
export function Button({ onClick }: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Internal logic
    
    // Call external handler if provided
    onClick?.(e);
  };
  
  return <button onClick={handleClick}>Click me</button>;
}
```

### Event Types

- Always use typed event handlers:

```tsx
// Good
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  // ...
}

// Avoid
function handleChange(e) {
  // ...
}
```

## Composition Patterns

### Component Composition

- Prefer composition over configuration when a component has many variants
- Use the children prop for flexible content
- Consider using compound components for complex UIs

```tsx
// Compound component example
<Tabs>
  <Tabs.List>
    <Tabs.Tab>Tab 1</Tabs.Tab>
    <Tabs.Tab>Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel>Content 1</Tabs.Panel>
  <Tabs.Panel>Content 2</Tabs.Panel>
</Tabs>
```

### Render Props

- Use render props when a component needs to share its internal state:

```tsx
<DataFetcher
  url="/api/data"
  render={({ data, isLoading, error }) => (
    isLoading ? <Spinner /> : error ? <ErrorMessage error={error} /> : <DataDisplay data={data} />
  )}
/>
```

## Accessibility

- Always include appropriate aria attributes
- Use semantic HTML elements
- Support keyboard navigation
- Ensure proper focus management
- Provide alternative text for images
- Use proper heading hierarchy

## Performance Considerations

### Memoization

- Use React.memo for expensive components
- Use useCallback for functions passed as props
- Use useMemo for expensive calculations

```tsx
// Memoize component
const MemoizedComponent = React.memo(function Component(props) {
  // ...
});

// Inside functional components
const memoizedCallback = useCallback(() => {
  // ...
}, [dependency1, dependency2]);

const memoizedValue = useMemo(() => {
  return computeExpensiveValue(dependency1, dependency2);
}, [dependency1, dependency2]);
```

### Avoid Prop Spreading

- Avoid spreading unknown props onto DOM elements
- Only spread known, safe props

```tsx
// Avoid
function Component(props) {
  return <div {...props} />;
}

// Better
function Component({ className, children, ...otherProps }) {
  return <div className={className} {...otherProps}>{children}</div>;
}
```

## Documentation

### Component Documentation

Every component should include:

- JSDoc comment describing its purpose
- Props documentation
- Usage example
- Any important notes or caveats

```tsx
/**
 * DataTable displays tabular data with sorting, filtering, and pagination.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   onRowClick={handleRowClick}
 * />
 * ```
 */
export function DataTable({ columns, data, onRowClick }: DataTableProps) {
  // ...
}
```

### Prop Documentation

- Document every prop with JSDoc comments
- Include type information, default values, and descriptions
- Mention required props

```tsx
export interface ButtonProps {
  /** The content to display inside the button */
  children: React.ReactNode;
  
  /** The variant style to use */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /** Whether the button is disabled */
  isDisabled?: boolean;
  
  /** Called when the button is clicked */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

## Examples

### Good Component Example

```tsx
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/core/components/ui/primitives/button';

/**
 * Counter component that allows incrementing and decrementing a value
 * with customizable step size.
 *
 * @example
 * ```tsx
 * <Counter initialValue={5} step={2} onChange={handleChange} />
 * ```
 */
export interface CounterProps {
  /** Initial value of the counter */
  initialValue?: number;
  
  /** Amount to increment/decrement by */
  step?: number;
  
  /** Maximum allowed value */
  max?: number;
  
  /** Minimum allowed value */
  min?: number;
  
  /** Called when the counter value changes */
  onChange?: (value: number) => void;
  
  /** Whether the counter is disabled */
  isDisabled?: boolean;
  
  /** Additional CSS class names */
  className?: string;
}

export function Counter({
  initialValue = 0,
  step = 1,
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
  onChange,
  isDisabled = false,
  className,
}: CounterProps) {
  const [count, setCount] = useState(initialValue);
  
  const handleIncrement = useCallback(() => {
    const newValue = Math.min(count + step, max);
    setCount(newValue);
    onChange?.(newValue);
  }, [count, max, onChange, step]);
  
  const handleDecrement = useCallback(() => {
    const newValue = Math.max(count - step, min);
    setCount(newValue);
    onChange?.(newValue);
  }, [count, min, onChange, step]);
  
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button 
        onClick={handleDecrement} 
        isDisabled={isDisabled || count <= min}
        aria-label="Decrement"
      >
        -
      </Button>
      
      <span className="w-8 text-center" aria-live="polite">
        {count}
      </span>
      
      <Button 
        onClick={handleIncrement} 
        isDisabled={isDisabled || count >= max}
        aria-label="Increment"
      >
        +
      </Button>
    </div>
  );
}
```

## Migration Plan

To standardize existing component APIs:

1. Identify components that don't follow these standards
2. Prioritize high-usage components for updates
3. Create a migration plan for each component
4. Update component APIs in small, incremental PRs
5. Update usage sites to match new APIs
6. Add deprecation warnings for breaking changes 