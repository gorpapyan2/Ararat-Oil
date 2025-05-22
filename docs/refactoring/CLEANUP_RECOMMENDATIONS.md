# Code Cleanup Recommendations

This document provides recommendations for further cleanup of the codebase based on duplication analysis and code inspection.

## High-Priority Areas

### 1. Test Files

Several test files still contain significant duplication and should be refactored to use the shared test utilities:

- `src/features/dashboard/hooks/__tests__/useDashboard.test.ts`
- `src/features/employees/hooks/__tests__/useEmployees.test.ts`
- `src/features/filling-systems/hooks/__tests__/useFillingSystem.test.ts`
- `src/features/finance/hooks/__tests__/useFinance.test.ts`
- `src/features/fuel-supplies/hooks/__tests__/useFuelSupplies.test.ts`

**Recommendation:** Apply the pattern established in `src/features/tanks/hooks/__tests__/useTanks.test.ts` to these files.

### 2. Form Components

Form implementations across features have considerable duplication:

- `src/features/finance/components/ExpenseDialogStandardized.tsx`
- `src/features/finance/components/TransactionDialogStandardized.tsx`
- `src/features/employees/components/EmployeeDialogStandardized.tsx`
- `src/features/auth/components/ProfileDialogStandardized.tsx`

**Recommendation:** Refactor these to use the `StandardForm` and `BaseDialog` components.

### 3. UI Component Duplicates

Several UI components have duplicated code:

- `src/core/components/ui/composed/form-fields.tsx` contains multiple duplicated fields
- `src/core/components/ui/primitives/language-switcher.tsx` has internal duplication
- `src/core/components/ui/dropdownmenu.tsx` duplicates code from `src/core/components/ui/primitives/dropdown-menu.tsx`

**Recommendation:** Remove the older versions and standardize on the newer implementations.

## Medium-Priority Areas

### 1. Service Implementations

Service implementations across features follow similar patterns but with slight variations:

- `src/features/fuel-prices/services/index.ts`
- `src/features/fuel-sales/services/fuel-sales.service.ts`
- `src/features/tanks/services/index.ts`
- `src/features/filling-systems/services/index.ts`

**Recommendation:** Create base service classes or utility functions to standardize common CRUD operations.

### 2. Hook Patterns

Several hooks implement similar patterns across features:

- `src/features/finance/hooks/useFinance.ts`
- `src/features/dashboard/hooks/useDashboard.ts`
- `src/features/fuel-prices/hooks/useFuelPrices.ts`
- `src/features/fuel-sales/hooks/useFuelSales.ts`

**Recommendation:** Create generic hook factories for common patterns (query hooks, mutation hooks, etc.).

### 3. Component Patterns

Similar component patterns appear across features:

- Page headers in various feature pages
- Filter components
- Form components

**Recommendation:** Extract common patterns into shared components.

## Low-Priority Areas

### 1. SQL Migrations

Duplication in SQL migration files:

- `src/migrations/*.sql` files contain similar patterns

**Recommendation:** Create SQL generation utilities or templates for common migration patterns.

### 2. Story Files

Duplication in Storybook story files:

- `src/stories/*.stories.tsx`
- `src/core/components/ui/__stories__/*.stories.tsx`

**Recommendation:** Use Storybook's component story format and inheritance to reduce duplication.

### 3. CSS/Theme Files

Duplication in styling:

- `src/styles/theme.css`

**Recommendation:** Extract common style patterns into variables or utility classes.

## Implementation Strategy

1. Start with high-priority areas to get the most immediate benefits
2. Implement changes iteratively, feature by feature
3. Update documentation as you go
4. Verify each change with tests
5. Continuously monitor duplication metrics

## Tracking Progress

Use the `jscpd` tool to track progress in reducing duplication:

```
npx jscpd src --threshold 5
```

The goal should be to reduce the overall duplication percentage from current 4.52% to below 3%. 