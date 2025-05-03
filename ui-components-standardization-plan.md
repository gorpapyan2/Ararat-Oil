# UI Components Standardization Plan

## Background

The codebase currently has multiple UI component implementations:
1. Base UI components in `src/components/ui/` (shadcn/ui style components)
2. Custom extensions in `src/components/ui-custom/` 
3. Significant duplication between these layers

Specific issues:
- `card.tsx` exists in both directories with overlapping functionality
- `table.tsx` exists in both directories with overlapping functionality
- No clear pattern for when to use base vs. custom components
- Inconsistent naming conventions (PascalCase vs. kebab-case)
- Some components may be unused or only used for development

## Standardization Strategy

### 1. Define Component Architecture

We'll adopt a clear 3-layer component architecture:

1. **Base Layer** (`src/components/ui/`): 
   - Foundational UI components with minimal styling
   - Direct extensions of shadcn/ui or other libraries
   - Only basic variants and functionality
   - Named with kebab-case files (e.g., `button.tsx`)

2. **Extended Layer** (`src/components/ui-extended/`): 
   - Extended versions of base components with app-specific styling
   - Additional variants and app-specific behavior
   - Clear composition pattern using base components
   - Named with kebab-case files (e.g., `data-card.tsx`)

3. **Feature Layer** (domain-specific directories):
   - Components used in specific features/domains
   - Composed of base and extended components
   - Located in feature-specific directories (e.g., `src/components/dashboard/`)

### 2. Migration Steps

1. **Component Audit**: 
   - Document all component usage across the app
   - Identify unused components
   - Map component relationships (which extend which)

2. **Directory Restructure**:
   - Rename `ui-custom` to `ui-extended` for clarity
   - Move any domain-specific components to feature directories

3. **Component Consolidation**:
   - For each component with duplication:
     - Ensure base component contains only essential functionality
     - Refactor extensions to clearly extend base components
     - Remove duplicate code
     - Follow consistent naming pattern

4. **Documentation**:
   - Create a component architecture document
   - Add inline documentation on component usage

### 3. Example Consolidation: Card Component

**Base Card Implementation** (`src/components/ui/card.tsx`):
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

// Basic CardHeader, CardTitle, CardDescription, CardContent, CardFooter components
// (simplified implementations)

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
```

**Extended Card Implementation** (`src/components/ui-extended/card.tsx`):
```tsx
import React from "react";
import { cn } from "@/lib/utils";
import {
  Card as BaseCard,
  CardHeader as BaseCardHeader,
  CardFooter as BaseCardFooter,
  CardTitle as BaseCardTitle,
  CardDescription as BaseCardDescription,
  CardContent as BaseCardContent,
} from "@/components/ui/card";

// Extended Card with variants
export interface CardProps extends React.ComponentPropsWithoutRef<typeof BaseCard> {
  variant?: "default" | "outline" | "elevated" | "subtle";
}

const Card = React.forwardRef<
  React.ElementRef<typeof BaseCard>,
  CardProps
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-card border-border/40 hover:shadow-md hover:-translate-y-1 transition-all",
    outline: "bg-transparent border-border hover:border-primary transition-colors",
    elevated: "bg-card border-0 shadow-lg",
    subtle: "bg-muted/50 border-0",
  };

  return (
    <BaseCard
      ref={ref}
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  );
});
Card.displayName = "Card";

// Extended versions of CardHeader, CardTitle etc.
// (with additional props and styling)

// Special purpose cards like StatsCard that build on the base components

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  StatsCard,
};
```

### 4. Implementation Plan

For each component:

1. **Review and Compare**: Compare base and custom implementations
2. **Define Structure**: Document props, variants, and behaviors for base and extended versions
3. **Implement Base**: Keep base version minimal, remove app-specific styling
4. **Implement Extension**: Create clear extension using composition
5. **Update Usage**: Refactor all usage to new pattern
6. **Documentation**: Add JSDoc comments
7. **Testing**: Verify all use cases work correctly

### 5. Naming Conventions

Standardize on:
- **Files**: kebab-case (`data-table.tsx`)
- **Components**: PascalCase (`DataTable`)
- **Props Interfaces**: PascalCase with `Props` suffix (`DataTableProps`)
- **Component Extensions**: Prefix with feature name if domain-specific (`DashboardCard`)

## Testing

1. Create a component showcase page for visual verification
2. Verify component behavior across all breakpoints
3. Test accessibility of all components
4. Verify component props and variants work correctly

## Timeline

1. Component Audit - 1-2 days
2. Directory Restructure - 0.5 day
3. Component Standards Document - 1 day
4. Card Component Consolidation - 1 day
5. Table Component Consolidation - 1-2 days
6. Other Component Standardization - 3-5 days
7. Component Showcase - 1 day
8. Testing - 2 days

Total: 10-15 days (incremental approach recommended) 