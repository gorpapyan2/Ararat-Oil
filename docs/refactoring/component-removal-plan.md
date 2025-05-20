# Component Removal Plan

This document outlines the process and timeline for removing deprecated components after their deprecation period has ended.

## Removal Timeline

Components will follow this timeline:

1. **Deprecation Phase** (0-6 months)
   - Component is marked as deprecated with JSDoc annotations
   - Console warnings are implemented to alert developers
   - Migration documentation is updated
   - Bridge components are created where needed

2. **Usage Monitoring Phase** (1-3 months)
   - Track console warnings in development and testing environments
   - Identify remaining usages and plan for migration
   - Update import statements in any remaining files

3. **Final Notice Phase** (1 month)
   - Send final notices to the development team
   - Verify no critical components depend on deprecated components
   - Prepare removal pull request

4. **Removal Phase**
   - Remove deprecated components
   - Update documentation
   - Verify application functions correctly

## Removal Process

### Before Removal

1. **Identify Components for Removal**
   - Check the `component-deprecation-schedule.md` for components past their removal date
   - Verify no critical dependencies on these components remain

2. **Create Removal Branch**
   - Create a branch for removing the deprecated components
   - Name it following the convention: `remove-deprecated-components-YYYY-MM`

3. **Verify Usage**
   - Run the application in development mode with console warnings enabled
   - Check for any console warnings related to the deprecated components
   - If warnings are found, update those components to use the feature versions

### Removal Steps

1. **Remove Components**
   - Delete the deprecated component files
   - Update any remaining import statements to use the feature components
   - Update index files to remove exports of deprecated components

2. **Update Documentation**
   - Update `component-deprecation-schedule.md` to mark components as removed
   - Update any documentation that references the removed components
   - Add notes to the migration documentation about the removed components

3. **Testing**
   - Run all tests to ensure the application still functions correctly
   - Perform manual testing of features that used the removed components
   - Verify no runtime errors related to missing components

4. **Submission**
   - Create a pull request for the removal branch
   - Include a detailed description of the components removed
   - Request reviews from relevant team members

## Removal Schedule

### December 2023 Removal

The following components are scheduled for removal in December 2023:

1. **Finance Components**
   - `src/components/transactions/TransactionListStandardized.tsx`
   - `src/components/transactions/TransactionsManagerStandardized.tsx`
   - `src/components/expenses/ExpensesManagerStandardized.tsx`

2. **Dashboard Components**
   - `src/components/dashboard/ProfitLossChart.tsx`
   - `src/components/dashboard/RevenueExpensesChart.tsx`

3. **Petrol Provider Components**
   - `src/components/petrol-providers/ProviderDialogStandardized.tsx`
   - `src/components/petrol-providers/ProviderManagerStandardized.tsx`
   - `src/components/petrol-providers/DeleteConfirmDialogStandardized.tsx`

4. **Fuel Supplies Components**
   - `src/components/fuel-supplies/FuelSuppliesManagerStandardized.tsx`
   - `src/components/fuel-supplies/FuelSuppliesFormStandardized.tsx`
   - `src/components/fuel-supplies/ConfirmDeleteDialogStandardized.tsx`
   - `src/components/fuel-supplies/ConfirmAddDialogStandardized.tsx`

### Future Removals

Future removal schedules will be planned based on deprecation dates:

1. **January 2024 Removal**
   - Components deprecated in July 2023
   - To be determined based on migration progress

2. **February 2024 Removal**
   - Components deprecated in August 2023
   - To be determined based on migration progress

## Monitoring Tools

1. **Console Warning Tracker**
   - Track deprecation warnings in the browser console during development
   - Log warnings to a centralized location for analysis

2. **Import Analysis**
   - Use static code analysis to identify imports of deprecated components
   - Generate reports of files that need to be updated

3. **Automated Testing**
   - Ensure all tests pass before and after component removal
   - Add specific tests for components migrated from deprecated versions

## Contingency Plan

If issues arise during the removal process:

1. **Revert Option**
   - Be prepared to revert the removal if critical issues are found
   - Have a rollback plan ready for production

2. **Extended Deprecation**
   - If a component is still widely used, consider extending its deprecation period
   - Update documentation to reflect the extended timeline

3. **Emergency Fixes**
   - Prepare emergency fixes for any unforeseen issues
   - Have team members available during the removal period

## Communication Plan

1. **Pre-Removal Announcements**
   - Announce planned removals in team meetings 2 weeks in advance
   - Send reminder emails 1 week and 1 day before removal

2. **Post-Removal Announcements**
   - Communicate successful removals to the team
   - Provide guidance on how to update any remaining code

3. **Documentation Updates**
   - Update all relevant documentation after component removal
   - Ensure migration guides are up to date 