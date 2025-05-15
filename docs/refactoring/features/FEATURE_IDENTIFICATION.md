# Feature Identification

This document tracks the identification of features and their components in the current codebase.

## Identified Features

### 1. Authentication Feature
**Location**: `src/components/auth/`
**Services**: `src/services/supabase.ts`
**Components**:
- [ ] Login form
- [ ] Registration form
- [ ] Password reset
- [ ] Auth guards
- [ ] Auth context/provider

### 2. Sales Feature
**Location**: `src/components/sales/`
**Services**: `src/services/sales/`
**Components**:
- [ ] Sales dashboard
- [ ] Sales reports
- [ ] Sales transactions
- [ ] Sales analytics

### 3. Finance Feature
**Location**: `src/components/finance/`
**Services**: 
  - `src/services/financials.ts`
  - `src/services/profit-loss.ts`
  - `src/services/expenses.ts`
**Components**:
- [ ] Financial reports
- [ ] Transactions
- [ ] Budget management
- [ ] Financial analytics
- [ ] Expense tracking

### 4. Fuel Management Feature
**Location**: 
  - `src/components/fuel/`
  - `src/components/fuel-supplies/`
  - `src/components/tanks/`
  - `src/components/filling-systems/`
**Services**:
  - `src/services/fuelManagement.ts`
  - `src/services/fuel-supplies.ts`
  - `src/services/fuel-prices.ts`
  - `src/services/fuel-types.ts`
  - `src/services/tanks.ts`
  - `src/services/filling-systems.ts`
**Components**:
- [ ] Supply management
- [ ] Inventory tracking
- [ ] Supply analytics
- [ ] Supplier management
- [ ] Tank management
- [ ] Filling system management
- [ ] Fuel price management

### 5. Employee Management Feature
**Location**: `src/components/employees/`
**Services**: 
  - `src/services/employees.ts`
  - `src/services/shifts.ts`
  - `src/services/shiftPaymentMethods.ts`
**Components**:
- [ ] Employee list
- [ ] Employee profiles
- [ ] Shift management
- [ ] Employee analytics
- [ ] Payment methods

### 6. Settings Feature
**Location**: `src/components/settings/`
**Components**:
- [ ] User settings
- [ ] System settings
- [ ] Preferences
- [ ] Configuration

### 7. Dashboard Feature
**Location**: `src/components/dashboard/`
**Services**: `src/services/dashboard.ts`
**Components**:
- [ ] Main dashboard
- [ ] Analytics widgets
- [ ] Quick actions
- [ ] Notifications

### 8. Transactions Feature
**Location**: `src/components/transactions/`
**Services**: `src/services/transactions.ts`
**Components**:
- [ ] Transaction list
- [ ] Transaction details
- [ ] Transaction reports
- [ ] Transaction analytics

### 9. Petrol Providers Feature
**Location**: `src/components/petrol-providers/`
**Services**: `src/services/petrol-providers.ts`
**Components**:
- [ ] Provider list
- [ ] Provider details
- [ ] Provider management
- [ ] Provider analytics

## Migration Status
- [ ] Auth Feature
- [ ] Sales Feature
- [ ] Finance Feature
- [ ] Fuel Management Feature
- [ ] Employee Management Feature
- [ ] Settings Feature
- [ ] Dashboard Feature
- [ ] Transactions Feature
- [ ] Petrol Providers Feature

## Notes
- Each feature will be migrated to its own directory under `src/features/`
- Features will maintain their own state, services, and types
- Shared components will be identified and moved to `src/shared/`
- Core functionality will be moved to `src/core/`
- Some features have multiple component directories that need to be consolidated

## Next Steps
1. Create detailed migration plans for each feature
2. Identify shared components and utilities
3. Plan the migration order
4. Create feature-specific documentation
5. Begin with Auth feature migration as it's a core dependency 