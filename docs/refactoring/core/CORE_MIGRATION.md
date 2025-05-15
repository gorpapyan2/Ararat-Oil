# Core Functionality Migration

This document tracks the migration of core application functionality.

## Configuration
**Current Location**: `src/config/`
**Target Location**: `src/core/config/`

### Files to Migrate
- [x] Environment configuration
- [x] API configuration
- [x] Feature flags
- [x] Constants
- [x] Theme configuration
- [x] Route configuration

## State Management
**Current Location**: `src/store/`
**Target Location**: `src/core/store/`

### Files to Migrate
- [x] App store (useAppStore.ts)
- [x] Todo store (useTodoStore.ts)
- [ ] Additional stores

## API Client
**Current Location**: `src/services/`
**Target Location**: `src/core/api/`

### Files to Migrate
- [x] API client setup
- [x] Request interceptors
- [x] Response interceptors
- [x] Error handling
- [x] API types
- [x] API utilities

## Internationalization
**Current Location**: `src/i18n/`
**Target Location**: `src/core/i18n/`

### Files to Migrate
- [ ] i18n setup
- [ ] Translation files
- [ ] Language utilities
- [ ] Format utilities
- [ ] Locale configuration

## Migration Guidelines
1. Keep core functionality minimal and essential
2. Ensure proper error handling
3. Maintain type safety
4. Document all configurations
5. Follow consistent patterns
6. Implement proper testing
7. Consider performance implications

## Progress Tracking
- [x] Configuration Migration
  - [x] Environment setup
  - [x] API configuration
  - [x] Feature flags
  - [x] Constants
  - [x] Theme configuration
  - [x] Route configuration
- [x] State Management Migration
  - [x] App store
  - [x] Todo store
  - [ ] Additional stores
- [x] API Client Migration
  - [x] Client setup
  - [x] Core functionality
  - [x] Type definitions
  - [x] Migrated endpoints (16/16 completed):
    - [x] Fuel Supplies API
    - [x] Shifts API
    - [x] Tanks API
    - [x] Fuel Types API
    - [x] Filling Systems API
    - [x] Petrol Providers API
    - [x] Expenses API
    - [x] Transactions API
    - [x] Dashboard API
    - [x] Profit Loss API
    - [x] Sales API
    - [x] Employees API
    - [x] Fuel Prices API
    - [x] Shift Payment Methods API (integrated in Shifts API)
    - [x] Fuel Management API (consolidated with relevant fuel endpoints)
    - [x] Financials API
  - [x] Method Naming Standardization
    - [x] Created API method naming conventions (docs/refactoring/core/API_METHOD_STANDARDIZATION.md)
    - [x] Updated fuel prices API methods
    - [x] Updated fuel types API methods
    - [x] Updated petrol providers API methods
    - [x] Updated fuel supplies API methods
    - [x] Updated tanks API methods
    - [x] Updated employees API methods
    - [x] Updated filling systems API methods
    - [x] Updated sales API methods
    - [ ] Remaining API modules
  - [x] Update imports in key files
    - [x] Supabase client imports
    - [x] API service imports
    - [x] Hooks using API services
    - [x] Service components updated:
      - [x] src/services/transactions.ts
      - [x] src/services/petrol-providers.ts
      - [x] src/services/fuel-prices.ts
      - [x] src/services/tanks.ts
      - [x] src/services/shifts.ts
      - [x] src/services/filling-systems.ts
      - [x] src/services/fuel-types.ts
      - [x] src/services/shiftPaymentMethods.ts
    - [x] Components updated:
      - [x] src/components/petrol-providers/ProviderManagerStandardized.tsx
      - [x] src/components/petrol-providers/ProviderDialogStandardized.tsx
      - [x] src/components/transactions/TransactionsManagerStandardized.tsx
      - [x] src/components/transactions/TransactionDialogStandardized.tsx
      - [x] src/components/transactions/TransactionListStandardized.tsx
      - [x] src/components/transactions/TransactionHeader.tsx
      - [x] src/components/fuel-supplies/FuelSuppliesManagerStandardized.tsx
      - [x] src/components/fuel-supplies/FuelSuppliesFormStandardized.tsx
      - [x] src/pages/fuel-management/FuelPricesPage.tsx
      - [x] src/components/expenses/ExpensesManagerStandardized.tsx
      - [x] src/components/filling-systems/TankDiagnostics.tsx
      - [x] src/components/filling-systems/FillingSystemFormStandardized.tsx
      - [x] src/components/filling-systems/FillingSystemManagerStandardized.tsx
      - [x] src/components/filling-systems/FillingSystemList.tsx
      - [x] src/features/dashboard/services/dashboard.ts
      - [x] src/hooks/useAuth.tsx
      - [x] src/hooks/useShift.ts
      - [x] src/pages/shifts/ShiftOpen.tsx
      - [x] src/pages/finance/ExpenseCreate.tsx
      - [x] src/pages/fuel-supplies/FuelSuppliesForm.tsx
    - [ ] Remaining component imports
  - [ ] Test & validate
- [ ] i18n Migration
  - [ ] Setup
  - [ ] Translations
  - [ ] Utilities
  - [ ] Configuration

## Next Steps
1. ~~Begin migrating state management~~ (Completed)
2. ~~Update imports in application to use the new state management~~ (Completed)
3. ~~Implement API client in core module~~ (Completed)
4. ~~Complete migration of remaining API endpoints~~ (Completed)
5. ~~Begin updating imports to use new API client~~ (Completed)
6. ~~Standardize API method naming~~ (In Progress - ~50% completed)
7. Complete updating all imports to use new API method names
8. Migrate i18n configuration
9. Test functionality after migration
10. Update documentation

## Notes
- Core functionality should be minimal and essential
- Ensure proper error handling and logging
- Maintain type safety throughout
- Consider performance implications
- Keep documentation up to date
- Follow consistent patterns
- Implement proper testing 

## Recent Updates
- Created API method naming standardization document
- Updated fuel prices API to use standardized method names
- Updated fuel types API to use standardized method names
- Updated petrol providers API to use standardized method names
- Updated fuel supplies API to use standardized method names
- Updated tanks API to use standardized method names
- Updated employees API to use standardized method names (fixed types and function calls)
- Updated filling systems API to use standardized method names
- Updated sales API to use standardized method names
- Updated FuelPricesPage.tsx to use new API method names
- Updated useFuelSuppliesFilters.ts to use new API method names
- Fixed FuelSuppliesForm.tsx to use correct API method names 