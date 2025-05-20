# React Query Hook Standardization Progress

This document tracks the progress of standardizing React Query hooks according to the patterns defined in [hook-standardization-guide.md](./hook-standardization-guide.md).

## New Automation Tools

To accelerate and ensure consistent hook standardization, we've added the following tools:

1. **Verification Script**: `npm run verify-hooks`
   - Analyzes all hooks in the codebase for compliance with standardization rules
   - Generates a report of issues found by feature and rule type
   - Checks query key formats, generic types, staleTime configuration, and more

2. **Hook Generator**: `npm run generate-hook <feature-name> <hook-name>`
   - Creates standardized hook files following our established patterns
   - Generates associated test files with recommended test structure
   - Example: `npm run generate-hook filling-systems useFillingSystem`

## Standardization Status

| Feature      | Status      | Issues Found | Fixed | Notes                                   |
|--------------|-------------|--------------|-------|----------------------------------------|
| Tanks        | Completed   | Missing FuelType interface | Yes   | Updated useTanks.ts with standard patterns |
| Filling Systems | Pending  | -            | -     | Need to review `useFillingSystem.ts`   |
| Employees    | Pending     | -            | -     | Need to review `useEmployees.ts`       |
| Petrol Providers | Pending | -            | -     | Need to review `usePetrolProviders.ts` |
| Fuel Sales   | Pending     | -            | -     | Need to review `useFuelSales.ts`       |
| Fuel Prices  | Pending     | -            | -     | Need to review `useFuelPrices.ts`      |
| Finance      | Completed   | Type issues  | Yes   | Fixed return type from `getProfitLoss` |
| Dashboard    | Pending     | -            | -     | Need to review `useDashboard.ts`       |
| Fuel Supplies| Pending     | -            | -     | Need to review `useFuelSupplies.ts`    |

## Overall Progress: 2/9 Features (22%)

## Latest Updates

- **2023-06-XX**: Created hook verification and generation scripts to automate standardization
- **2023-06-XX**: Added automated checks for 5 key standardization rules
- **2023-06-XX**: Standardized Tanks feature hooks, added missing FuelType interface
- **2023-06-XX**: Fixed return type issue with `deleteTank` mutation to match service implementation
- **2023-06-XX**: Started hook standardization effort with Finance feature
- **2023-06-XX**: Created hook standardization guide with patterns and examples
- **2023-06-XX**: Fixed type issues in Finance feature's `useFinance.ts` hook

## Common Issues Found

1. **Inconsistent Query Key Formats**: Some hooks use string arrays, others use plain strings
2. **Missing Generic Types**: Many hooks lack proper TypeScript generics for query results and error types
3. **Inconsistent Error Handling**: Different approaches to error handling across features
4. **Missing Cache Configuration**: Inconsistent or missing staleTime, cacheTime configurations
5. **No Combined Loading/Error States**: Many hooks expose individual loading/error states without combined states
6. **Missing Type Definitions**: Some interfaces like FuelType were referenced but not defined
7. **Incorrect Return Types**: Return types of mutations not matching service implementation (e.g., deleteTank)

## Verification Rules

The verification script checks the following rules:

| Rule | Description | Importance |
|------|-------------|------------|
| Query Keys as Arrays | Query keys should be defined as arrays, not strings | High |
| Proper Generics | useQuery and useMutation should include proper TypeScript generics | High |
| StaleTime Config | Queries should have a staleTime configuration | Medium |
| Combined States | Hooks should expose isLoading and error states | Medium |
| Consistent Returns | Hooks should return an object with consistent property names | High |

## Next Steps

1. Run the verification script on all features to identify remaining issues
2. Standardize `useFillingSystem.ts` hook following the established patterns
3. Update `useEmployees.ts` to comply with standardization guide
4. Add ESLint rules to enforce hook patterns

## Timeline

- **Week 1**: Finance, Dashboard hooks ✅ Finance complete
- **Week 1**: Tanks, Filling Systems, Employees hooks ✅ Tanks complete
- **Week 3**: Petrol Providers, Fuel Sales, Fuel Prices hooks
- **Week 4**: Fuel Supplies and final verification 