# UI Component Standardization Plan

## Strategy for UI Component Architecture

Based on the analysis of the codebase, we need to implement a clear 3-layer architecture for UI components:

### 1. Base Layer: Core Primitive Components
These are the simplest building blocks, styling-agnostic, with accessibility features built-in:
- **Location**: `src/components/ui/primitives/`
- **Purpose**: Provide the foundation with proper accessibility, event handling, and React patterns
- **Example**: A base `Card` component that handles the structure, refs, and accessibility

### 2. Styled Layer: Design System Components  
These are primitive components with our design system styling applied:
- **Location**: `src/components/ui/`
- **Purpose**: Apply our design tokens and styling to primitive components
- **Example**: The standard styled `Card` component with our design system's appearance

### 3. Composed Layer: Enhanced Components
These are specialized compositions of styled components for specific use cases:
- **Location**: `src/components/ui/composed/`
- **Purpose**: Provide ready-to-use components for specific use cases
- **Example**: `MetricCard`, `StatsCard`, etc.

## Implementation Plan for Card Components

### 1. Current Issues

We currently have multiple implementations with overlapping functionality:
- `src/components/ui/card.tsx`: Basic card with shadcn styling
- `src/components/ui-custom/card.tsx`: Custom card extending the base card
- `src/components/ui-custom/data-card.tsx`: Specialized data presentation cards
- `src/components/ui/card-grid.tsx`: Card grid with another MetricCard implementation

This leads to:
- **Duplication**: Multiple implementations of similar functionality
- **Inconsistency**: Different styling and props across implementations
- **Confusion**: Developers aren't sure which card component to use
- **Maintenance burden**: Changes need to be made in multiple places

### 2. Consolidation Approach

We will:

1. Create a unified card implementation following the 3-layer architecture
2. Ensure backward compatibility through careful refactoring
3. Document the new component system
4. Update all usages to point to the correct components

### 3. Consolidated Component Structure

#### Base Primitives (`src/components/ui/primitives/card.tsx`)
```tsx
// Basic Card primitive with accessibility features
export const CardPrimitive = React.forwardRef<HTMLDivElement, CardPrimitiveProps>(/* ... */);

// Other primitives: CardHeaderPrimitive, CardFooterPrimitive, etc.
```

#### Design System Components (`src/components/ui/card.tsx`)
```tsx
// Main Card with design system styles
export const Card = React.forwardRef<HTMLDivElement, CardProps>(/* ... */);

// Standard subcomponents
export const CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardMedia, CardActions;
```

#### Composed Components (`src/components/ui/composed/cards.tsx`)
```tsx
// Specialized cards for various use cases
export const MetricCard: React.FC<MetricCardProps>;
export const StatsCard: React.FC<StatsCardProps>;
export const ActionCard: React.FC<ActionCardProps>;
export const SummaryCard: React.FC<SummaryCardProps>;
```

### 4. Implementation Details

The consolidated Card component will:

1. **Support all current variant styles**:
   - Default, outline, elevated, subtle
   - Custom variants from ui-custom/card.tsx

2. **Support all current props**:
   - Support for sizes, alignment options
   - Support for noPadding option

3. **Have consistent naming and behavior**:
   - Clear, consistent prop names
   - Consistent default behavior

4. **Keep backward compatibility**:
   - Ensure existing code continues to work
   - Export compatible interfaces

### 5. Migration Steps

1. **Create new Card structure**:
   - Implement the primitives layer
   - Implement the design system layer
   - Implement the composed components layer

2. **Update imports in existing components**:
   - Gradually update imports to point to new location
   - Use proxies for backward compatibility if needed

3. **Deprecate old components**:
   - Mark old components as deprecated
   - Provide clear migration path

4. **Document new system**:
   - Create clear documentation
   - Provide examples for each use case

### 6. Implementation Example for Card Component

```tsx
// In src/components/ui/card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'elevated' | 'subtle';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: "bg-card border-border/40",
      outline: "bg-transparent border-border",
      elevated: "bg-card border-0 shadow-lg",
      subtle: "bg-muted/50 border-0",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border shadow transition-all duration-200",
          "hover:shadow-md",
          variantClasses[variant],
          className,
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

// ... other components and exports
```

## Timeline

1. **Phase 1 (1-2 days)**:
   - Create new directory structure
   - Implement base Card components

2. **Phase 2 (2-3 days)**:
   - Implement composed Card components
   - Update documentation

3. **Phase 3 (1-2 days)**:
   - Update imports in existing components
   - Test for regressions

4. **Phase 4 (1 day)**:
   - Clean up deprecated components
   - Final testing

## Success Criteria

- All duplicate card implementations consolidated
- Clear documentation exists for component usage
- No regressions in existing functionality
- Reduced bundle size from removing duplicate code 