# Component Deprecation Schedule

This document tracks the deprecation and planned removal of legacy components that have been migrated to the feature-based architecture.

## Deprecation Timeline Guidelines

- **Notice Period**: Components will remain with deprecation notices for 3-6 months before removal
- **Warning Implementation**: All deprecated components will log console warnings during development
- **Documentation**: Migration guides will be updated with information about each deprecated component
- **Removal**: Components will be removed after their planned removal date

## Tracking Table

| Component | Path | Deprecated On | Removal Date | Replacement | Status | Notes |
|-----------|------|---------------|--------------|-------------|--------|-------|
| TransactionListStandardized | src/components/transactions/TransactionListStandardized.tsx | 2023-06-19 | 2023-12-19 | @/features/finance/components/TransactionListStandardized | Deprecated | Core finance component |
| TransactionsManagerStandardized | src/components/transactions/TransactionsManagerStandardized.tsx | 2023-06-19 | 2023-12-19 | @/features/finance/components/TransactionsManagerStandardized | Deprecated | Core finance component |
| ExpensesManagerStandardized | src/components/expenses/ExpensesManagerStandardized.tsx | 2023-06-19 | 2023-12-19 | @/features/finance/components/ExpensesManagerStandardized | Deprecated | Core finance component |
| ProfitLossChart | src/components/dashboard/ProfitLossChart.tsx | 2023-06-16 | 2023-12-16 | @/features/dashboard/components/ProfitLossChart | Deprecated | Visualization component |
| RevenueExpensesChart | src/components/dashboard/RevenueExpensesChart.tsx | 2023-06-16 | 2023-12-16 | @/features/dashboard/components/RevenueExpensesChart | Deprecated | Visualization component |
| ProviderDialogStandardized | src/components/petrol-providers/ProviderDialogStandardized.tsx | 2023-06-17 | 2023-12-17 | @/features/petrol-providers/components/ProviderDialogStandardized | Deprecated | Dialog component |
| ProviderManagerStandardized | src/components/petrol-providers/ProviderManagerStandardized.tsx | 2023-06-17 | 2023-12-17 | @/features/petrol-providers/components/ProviderManagerStandardized | Deprecated | Manager component |
| DeleteConfirmDialogStandardized | src/components/petrol-providers/DeleteConfirmDialogStandardized.tsx | 2023-06-17 | 2023-12-17 | @/features/petrol-providers/components/DeleteConfirmDialogStandardized | Deprecated | Dialog component |
| FuelSuppliesManagerStandardized | src/components/fuel-supplies/FuelSuppliesManagerStandardized.tsx | 2023-06-17 | 2023-12-17 | @/features/fuel-supplies/components/FuelSuppliesManagerStandardized | Deprecated | Manager component |
| FuelSuppliesFormStandardized | src/components/fuel-supplies/FuelSuppliesFormStandardized.tsx | 2023-06-17 | 2023-12-17 | @/features/fuel-supplies/components/FuelSuppliesFormStandardized | Deprecated | Form component |
| ConfirmDeleteDialogStandardized | src/components/fuel-supplies/ConfirmDeleteDialogStandardized.tsx | 2023-06-17 | 2023-12-17 | @/features/fuel-supplies/components/ConfirmDeleteDialogStandardized | Deprecated | Dialog component |
| ConfirmAddDialogStandardized | src/components/fuel-supplies/ConfirmAddDialogStandardized.tsx | 2023-06-17 | 2023-12-17 | @/features/fuel-supplies/components/ConfirmAddDialogStandardized | Deprecated | Dialog component |

## Phase 1: Finance Component Deprecation (June - December 2023)

The following finance-related components have been migrated to the feature-based architecture and will be deprecated:

1. **TransactionListStandardized**: 
   - Original: `src/components/transactions/TransactionListStandardized.tsx`
   - Replacement: `@/features/finance/components/TransactionListStandardized`
   - Deprecation Date: 2023-06-19
   - Planned Removal: 2023-12-19

2. **TransactionsManagerStandardized**:
   - Original: `src/components/transactions/TransactionsManagerStandardized.tsx`
   - Replacement: `@/features/finance/components/TransactionsManagerStandardized` 
   - Deprecation Date: 2023-06-19
   - Planned Removal: 2023-12-19

3. **ExpensesManagerStandardized**:
   - Original: `src/components/expenses/ExpensesManagerStandardized.tsx`
   - Replacement: `@/features/finance/components/ExpensesManagerStandardized`
   - Deprecation Date: 2023-06-19
   - Planned Removal: 2023-12-19

## Phase 2: Dashboard Component Deprecation (June - December 2023)

The following dashboard-related components have been migrated to the feature-based architecture and will be deprecated:

1. **ProfitLossChart**:
   - Original: `src/components/dashboard/ProfitLossChart.tsx`
   - Replacement: `@/features/dashboard/components/ProfitLossChart`
   - Deprecation Date: 2023-06-16
   - Planned Removal: 2023-12-16

2. **RevenueExpensesChart**:
   - Original: `src/components/dashboard/RevenueExpensesChart.tsx` 
   - Replacement: `@/features/dashboard/components/RevenueExpensesChart`
   - Deprecation Date: 2023-06-16
   - Planned Removal: 2023-12-16

3. **RevenueInsights**:
   - Original: `src/components/dashboard/RevenueInsights.tsx`
   - Replacement: To be created in dashboard feature
   - Deprecation Date: Pending migration
   - Planned Removal: 6 months after migration

4. **FuelDistributionChart**:
   - Original: `src/components/dashboard/FuelDistributionChart.tsx`
   - Replacement: To be created in dashboard feature
   - Deprecation Date: Pending migration
   - Planned Removal: 6 months after migration

## Phase 3: Provider Component Deprecation (June - December 2023)

The following petrol provider-related components have been migrated to the feature-based architecture and will be deprecated:

1. **ProviderDialogStandardized**:
   - Original: `src/components/petrol-providers/ProviderDialogStandardized.tsx`
   - Replacement: `@/features/petrol-providers/components/ProviderDialogStandardized`
   - Deprecation Date: 2023-06-17
   - Planned Removal: 2023-12-17

2. **ProviderManagerStandardized**:
   - Original: `src/components/petrol-providers/ProviderManagerStandardized.tsx`
   - Replacement: `@/features/petrol-providers/components/ProviderManagerStandardized`
   - Deprecation Date: 2023-06-17
   - Planned Removal: 2023-12-17

3. **DeleteConfirmDialogStandardized**:
   - Original: `src/components/petrol-providers/DeleteConfirmDialogStandardized.tsx`
   - Replacement: `@/features/petrol-providers/components/DeleteConfirmDialogStandardized`
   - Deprecation Date: 2023-06-17
   - Planned Removal: 2023-12-17

## Phase 4: Fuel Supplies Component Deprecation (June - December 2023)

The following fuel supplies-related components have been migrated to the feature-based architecture and will be deprecated:

1. **FuelSuppliesManagerStandardized**:
   - Original: `src/components/fuel-supplies/FuelSuppliesManagerStandardized.tsx`
   - Replacement: `@/features/fuel-supplies/components/FuelSuppliesManagerStandardized`
   - Deprecation Date: 2023-06-17
   - Planned Removal: 2023-12-17

2. **FuelSuppliesFormStandardized**:
   - Original: `src/components/fuel-supplies/FuelSuppliesFormStandardized.tsx`
   - Replacement: `@/features/fuel-supplies/components/FuelSuppliesFormStandardized`
   - Deprecation Date: 2023-06-17
   - Planned Removal: 2023-12-17

3. **ConfirmDeleteDialogStandardized**:
   - Original: `src/components/fuel-supplies/ConfirmDeleteDialogStandardized.tsx`
   - Replacement: `@/features/fuel-supplies/components/ConfirmDeleteDialogStandardized`
   - Deprecation Date: 2023-06-17
   - Planned Removal: 2023-12-17

4. **ConfirmAddDialogStandardized**:
   - Original: `src/components/fuel-supplies/ConfirmAddDialogStandardized.tsx`
   - Replacement: `@/features/fuel-supplies/components/ConfirmAddDialogStandardized`
   - Deprecation Date: 2023-06-17
   - Planned Removal: 2023-12-17

## Implementation Plan

For each component:

1. Add deprecation notices following the template in `src/docs/deprecation-notice-template.md`
2. Create bridge components where needed to minimize breaking changes
3. Update import statements in documentation examples
4. Implement console warnings for development builds
5. Remove components after their planned removal date

## Monitoring

- Track component usage through console warnings during development
- Review and update this schedule monthly
- Communicate deprecation plans in team meetings and documentation updates 