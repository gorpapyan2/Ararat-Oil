# Legacy Component Re-exports

## Overview

This document explains the approach taken to maintain backward compatibility while refactoring our UI component system. We've moved implementations to the primitives directory but kept the original import paths working through re-exports.

## Problem

After moving our UI components to a more organized structure in the `primitives` directory, we faced import errors across the codebase. Updating every import would be time-consuming and error-prone.

## Solution: Re-exports Pattern

Instead of changing all imports throughout the application, we created re-export files in the original locations that simply re-export the components from their new locations.

### Example

Original component in `src/core/components/ui/button.tsx`:
```tsx
export function Button() { ... }
```

After refactoring:
1. Component moved to `src/core/components/ui/primitives/button.tsx`
2. Original file replaced with re-exports:
```tsx
export { Button, ButtonLink, buttonVariants } from "@/core/components/ui/primitives/button";
```

## Components Using This Pattern

The following components use the re-export pattern:

- `button.tsx` → Re-exports from `primitives/button.tsx`
- `card.tsx` → Re-exports from `primitives/card.tsx`
- `form.tsx` → Re-exports from `primitives/form.tsx`
- `sheet.tsx` → Re-exports from `primitives/sheet.tsx`
- `tooltip.tsx` → Re-exports from `primitives/tooltip.tsx`
- `toast.tsx` → Re-exports from `primitives/toast.tsx`

## Benefits

1. **Backward Compatibility**: Existing imports continue to work
2. **Incremental Migration**: Components can be migrated one by one
3. **Reduced Regression Risk**: Minimizes chances of breaking changes
4. **Clean Implementation**: Component logic is only in one place

## Future Improvements

1. Consider implementing a build-time path alias system
2. Add ESLint rules to encourage direct imports from the primitive folder
3. Eventually deprecate the re-export pattern in favor of direct imports

## Related Documentation

- [UI Component Fixes](./ui-component-fixes.md)
- [Migration Summary](./migration-summary.md) 