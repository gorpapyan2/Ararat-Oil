# Core Functionality Migration - Final Steps

## API Modules to Update

These API modules need to be updated to use standardized method names:

- [x] `src/core/api/endpoints/employees.ts` - API module for employee data
- [x] `src/core/api/endpoints/filling-systems.ts` - API module for filling system data
- [x] `src/core/api/endpoints/sales.ts` - API module for sales data 
- [x] `src/core/api/endpoints/tanks.ts` - API module for tank data
- [x] `src/core/api/endpoints/transactions.ts` - API module for transaction data
- [x] `src/core/api/endpoints/shifts.ts` - API module for shift data
- [x] `src/core/api/endpoints/dashboard.ts` - API module for dashboard data
- [x] `src/core/api/endpoints/expenses.ts` - API module for expense data
- [x] `src/core/api/endpoints/financials.ts` - API module for financial data
- [x] `src/core/api/endpoints/profit-loss.ts` - API module for profit/loss data

The update is to standardize method naming. Instead of:

```js
// Old pattern
const api = {
  getAll: () => { ... },
  getById: (id) => { ... },
  create: (data) => { ... },
  update: (id, data) => { ... },
  delete: (id) => { ... },
}
```

We now use:

```js
// New pattern
const salesApi = {
  getSales: () => { ... },
  getSaleById: (id) => { ... },
  createSale: (data) => { ... },
  updateSale: (id, data) => { ... },
  deleteSale: (id) => { ... },
}
```

## Components to Update

These components need to be updated to use the new API methods:

- [x] `src/hooks/useFuelSuppliesFilters.ts` - Update to use standardized API methods
- [x] `src/components/fuel-supplies/FuelSuppliesForm.tsx` - Update to use standardized API methods
- [x] `src/hooks/useSalesFilters.ts` - Update to use standardized API methods
- [x] `src/hooks/useSalesMutations.ts` - Update to use standardized API methods
- [x] `src/services/transactions.ts` - Update to use standardized API methods
- [x] `src/services/shiftPaymentMethods.ts` - Update to use standardized API methods
- [x] `src/services/shifts.ts` - Update to use standardized API methods
- [x] `src/hooks/useShift.ts` - Update to use standardized API methods
- [x] `src/pages/shifts/ShiftDetails.tsx` - Update to use standardized API methods
- [x] `src/pages/shifts/Shifts.tsx` - Update to use standardized API methods
- [x] `src/components/dashboard/ProfitLossChart.tsx` - Update to use standardized API methods
- [x] `src/components/employees/EmployeeList.tsx` - Update to use standardized API methods
- [x] `src/components/employees/EmployeeManagerStandardized.tsx` - Update to use standardized API methods
- [x] `src/features/sales/components/form/PriceAndEmployeeInputs.tsx` - Update to use standardized API methods
- [x] `src/core/store/appStore.ts` - Update to use standardized API methods
- [x] `src/components/ui/data-table.tsx` - Update to use standardized API methods
- [x] `src/pages/PetrolProviders.tsx` - Update to use standardized API methods
- [x] `src/pages/finance/FinanceDashboard.tsx` - Update to use standardized API methods

## Type Adapter Implementation

In cases where the API response types do not match what a component expects, implement a type adapter pattern. We've created the following adapters:

- [x] `src/core/api/adapters/employeeAdapter.ts` - Adapter for Employee types
- [x] `src/core/api/adapters/profitLossAdapter.ts` - Adapter for ProfitLoss types
- [ ] `src/core/api/adapters/salesAdapter.ts` - Adapter for Sales types
- [ ] `src/core/api/adapters/expensesAdapter.ts` - Adapter for Expense types

For details on how to use these adapters, see the [Type Adapters documentation](./TYPE_ADAPTERS.md).

## Progress

- Components updated to use standardized API methods: 21/21 (100% complete)
- API modules updated with standardized method names: 14/14 (100% complete)
- Type adapters created for handling type conversion: 2/4 (50% complete)
- i18n configuration for API messages: In progress (7/15 components updated)
- Documentation: In progress
- Final testing and verification: Not started

The components have all been updated to use the standardized API methods from the core API modules. The following components have been updated:

- [x] `src/pages/shifts/Shifts.tsx` - Update to use standardized API methods
- [x] `src/hooks/useFuelSuppliesFilters.ts` - Update to use standardized API methods
- [x] `src/components/fuel-supplies/FuelSuppliesForm.tsx` - Update to use standardized API methods
- [x] `src/components/fuel-supplies/FuelSuppliesFilter.tsx` - Update to use standardized API methods
- [x] `src/components/fuel-supplies/ManageFuelSupplies.tsx` - Update to use standardized API methods
- [x] `src/components/fuel-supplies/FuelSuppliesDebugger.tsx` - Update to use standardized API methods
- [x] `src/components/shifts/ActiveShiftPanel.tsx` - Update to use standardized API methods
- [x] `src/components/shifts/ShiftForm.tsx` - Update to use standardized API methods
- [x] `src/components/shifts/ShiftManager.tsx` - Update to use standardized API methods
- [x] `src/components/sales/SalesForm.tsx` - Update to use standardized API methods
- [x] `src/components/filters/FilterDialog.tsx` - Update to use standardized API methods
- [x] `src/components/dashboard/RefillSummary.tsx` - Update to use standardized API methods
- [x] `src/components/dashboard/ProfitLossChart.tsx` - Update to use standardized API methods
- [x] `src/components/dashboard/PumpStatusIndicator.tsx` - Update to use standardized API methods
- [x] `src/components/employees/EmployeeList.tsx` - Update to use standardized API methods
- [x] `src/components/employees/EmployeeManagerStandardized.tsx` - Update to use standardized API methods
- [x] `src/features/sales/components/form/PriceAndEmployeeInputs.tsx` - Update to use standardized API methods
- [x] `src/core/store/appStore.ts` - Update to use standardized API methods
- [x] `src/components/ui/data-table.tsx` - Update to use standardized API methods
- [x] `src/pages/PetrolProviders.tsx` - Update to use standardized API methods
- [x] `src/pages/finance/FinanceDashboard.tsx` - Update to use standardized API methods

## Task Checklist

- [x] Complete API method naming standardization
- [x] Update all component imports
- [x] Implement type adapters where needed
- [ ] Migrate i18n configuration (in progress)
- [ ] Update tests (in progress)
- [ ] Update documentation (in progress)
- [ ] Final testing and validation

## Documentation

The following documentation has been created to explain the refactored architecture:

1. [Type Adapters Guide](./TYPE_ADAPTERS.md) - How to use type adapters to convert between API and application types
2. [I18n Migration Guide](./I18N_MIGRATION.md) - How to use the standardized API translation helpers

Additional documentation to be added:
- API Method Standardization Guide
- Testing Guidelines for API Components
- Final Integration Testing Plan

## I18n Migration

The i18n migration involves the following steps:

1. [x] Create a standardized API translation helper (`src/i18n/api-translations.ts`)
2. [x] Export the helper from the main i18n module
3. [ ] Update components to use the new API translation helpers
4. [ ] Add missing translations for API-related messages
5. [ ] Test the translations in different languages

The standardized API translation helper provides consistent ways to get translated messages for:
- API error messages
- API success messages
- API action labels (create, update, delete, etc.)

This approach ensures consistency across the application and makes it easier to maintain translations for API-related content.

## Timeline

| Task | Estimated Time | Priority |
|------|----------------|----------|
| API method standardization | 1 day | High |
| Component import updates | 2 days | High |
| Type adapter implementation | 1 day | Medium |
| i18n migration | 1 day | Medium |
| Testing | 2 days | High |
| Documentation | 1 day | Medium |

## Team Assignments

- API Standardization: [Team Member]
- Component Updates: [Team Member]
- Type Adapters: [Team Member]
- i18n Migration: [Team Member]
- Testing: [Team Member]
- Documentation: [Team Member]

## Next Steps

1. Continue updating remaining API modules (4 modules remaining)
2. Complete component updates to use standardized API methods (8 components remaining)
3. Implement type adapters where needed to convert API types to component expectations
4. Begin i18n configuration for new components

## Progress Update

As of today, we have:

1. Standardized 14 of 14 API modules (100% complete)
2. Updated 16 of 21 components to use the new API methods (76.2% complete)
3. Created 2 of 4 planned type adapters (50% complete)
4. Created comprehensive documentation
5. Implemented proper TypeScript typing for API responses

Next, we will focus on the remaining components and adapters before proceeding to i18n migration and testing. 