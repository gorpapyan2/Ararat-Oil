# Component Deprecation Guide

## Overview

As part of our architectural refactoring, we've moved components from the legacy directory structure to the new feature-based architecture. To ensure backward compatibility while encouraging migration to the new structure, we've implemented a deprecation strategy with bridge components.

## Bridge Components

Bridge components serve as a compatibility layer between old import paths and new component locations. They:

1. Import the actual component from its new location
2. Re-export the component with the same interface
3. Log deprecation warnings in development mode
4. Track usage for monitoring

## Example Bridge Component

```tsx
// src/components/transactions/TransactionList.tsx (BRIDGE COMPONENT)
import { TransactionList } from '@/features/finance/components/TransactionList';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TransactionList',
    oldPath: '@/components/transactions/TransactionList',
    newPath: '@/features/finance/components/TransactionList',
    removalDate: '2023-12-31'
  });
}

// Re-export the component
export default TransactionList;
```

## Deprecation Warnings

When using a deprecated component, developers will see console warnings in development mode:

```
[DEPRECATED] The component "TransactionList" imported from "@/components/transactions/TransactionList" 
is deprecated and will be removed after 2023-12-31. 
Please update your import to "@/features/finance/components/TransactionList".
```

## Migration Timeline

1. **Current Phase**: Bridge components provide backward compatibility
2. **Transition Period**: Gradually update imports throughout the codebase
3. **Removal Phase**: After the specified removal date, bridge components will be removed

## How to Migrate Your Code

### 1. Check Console Warnings

During development, check your browser console for deprecation warnings. These warnings indicate which components you need to update.

### 2. Update Import Paths

Replace imports from `@/components/` with imports from their new locations:

```tsx
// BEFORE
import TransactionList from '@/components/transactions/TransactionList';

// AFTER
import { TransactionList } from '@/features/finance/components/TransactionList';
```

### 3. Update Component Usage

Some components may have slightly different props or usage patterns in their new location. Refer to the component documentation or check TypeScript errors for guidance.

### 4. Verify Changes

After updating imports, verify that your component still works as expected. Run tests and check for any visual or functional regressions.

## Finding New Component Locations

Use the following resources to find the new location of a component:

1. **Migration Documentation**: Check `docs/refactoring/` for migration reports
2. **Console Warnings**: The deprecation warning shows the new import path
3. **Codebase Search**: Search for the component name in the `src/features` and `src/core` directories

## Special Cases

### Renamed Components

Some components have been renamed during migration. In these cases:

1. The deprecation warning will indicate the new component name
2. You may need to update your code to use the new component API

### UI Components

All UI components have been moved to `src/core/components/ui`. They are now organized as:

- Primitives: `src/core/components/ui/primitives/`
- Composed: `src/core/components/ui/composed/`

## Monitoring and Enforcement

1. **Usage Tracking**: We track the usage of deprecated components to prioritize migration efforts
2. **CI Checks**: Our CI pipeline now includes checks for deprecated component usage
3. **Future Enforcement**: After the removal date, imports from deprecated paths will cause build errors

## Need Help?

If you encounter issues migrating from deprecated components:

1. Check the component's documentation in the new location
2. Refer to migration guides in `docs/refactoring/`
3. Reach out to the architecture team for assistance 