# Component Categorization Report

## Overview

This report categorizes components in the codebase to help determine which ones should be moved to core, feature, or shared directories.

## Summary

- **Already in correct location**: 0 components
- **Core components**: 0 components
- **Feature components**: 0 components
- **Shared components**: 0 components
- **Uncategorized**: 347 components

## Core Components

These UI primitive components should be moved to `src/core/components`:



## Feature Components

These feature-specific components should be moved to their respective feature directories:



## Shared Components

These utility components should be moved to `src/shared/components`:



## Uncategorized Components

These components need manual review to determine their appropriate location:

### Directory: src

- `src\test-utils.tsx`
- `src\main.tsx`
- `src\App.tsx`

### Directory: src\components\dashboard

- `src\components\dashboard\RevenueInsights.tsx`
- `src\components\dashboard\RevenueExpensesChart.tsx`
- `src\components\dashboard\ProfitLossChart.tsx`
- `src\components\dashboard\FuelDistributionChart.tsx`

### Directory: src\components\dev

- `src\components\dev\ToastTester.tsx`
- `src\components\dev\ResponsiveTester.tsx`
- `src\components\dev\DevToolsMenu.tsx`
- `src\components\dev\CardComponentsTester.tsx`

### Directory: src\components\dialogs

- `src\components\dialogs\ConfirmationDialogStandardized.tsx`
- `src\components\dialogs\ConfirmationController.tsx`

### Directory: src\components\employees

- `src\components\employees\EmployeesTable.tsx`
- `src\components\employees\EmployeeManagerStandardized.tsx`
- `src\components\employees\EmployeeList.tsx`
- `src\components\employees\EmployeeHeader.tsx`
- `src\components\employees\EmployeeDialogStandardized.tsx`

### Directory: src\components\enhanced

- `src\components\enhanced\ErrorBoundary.tsx`

### Directory: src\components\expenses

- `src\components\expenses\ExpensesTable.tsx`
- `src\components\expenses\ExpensesManagerStandardized.tsx`
- `src\components\expenses\ExpensesFormStandardized.tsx`
- `src\components\expenses\CategoryManagerStandardized.tsx`

### Directory: src\components\fuel

- `src\components\fuel\FuelManagementDashboard.tsx`

### Directory: src\components\fuel-supplies

- `src\components\fuel-supplies\FuelSuppliesTable.tsx`
- `src\components\fuel-supplies\FuelSuppliesSearchBar.tsx`
- `src\components\fuel-supplies\FuelSuppliesRangesFilters.tsx`
- `src\components\fuel-supplies\FuelSuppliesProviderSelect.tsx`
- `src\components\fuel-supplies\FuelSuppliesManagerStandardized.tsx`
- `src\components\fuel-supplies\FuelSuppliesHeader.tsx`
- `src\components\fuel-supplies\FuelSuppliesFormStandardized.tsx`
- `src\components\fuel-supplies\FuelSuppliesFilters.tsx`
- `src\components\fuel-supplies\FuelSuppliesDebugger.tsx`
- `src\components\fuel-supplies\FuelSuppliesDatePicker.tsx`
- `src\components\fuel-supplies\ConfirmDeleteDialogStandardized.tsx`
- `src\components\fuel-supplies\ConfirmAddDialogStandardized.tsx`

### Directory: src\components\fuel-supplies\data-table

- `src\components\fuel-supplies\data-table\FuelSuppliesDataTable.tsx`

### Directory: src\components\fuel-supplies\filters

- `src\components\fuel-supplies\filters\RangeSliderFilter.tsx`
- `src\components\fuel-supplies\filters\ProviderFilter.tsx`
- `src\components\fuel-supplies\filters\FilterBar.tsx`
- `src\components\fuel-supplies\filters\DateRangePicker.tsx`
- `src\components\fuel-supplies\filters\DateRangeFilter.tsx`
- `src\components\fuel-supplies\filters\AdvancedSearchInput.tsx`

### Directory: src\components\fuel-supplies\form

- `src\components\fuel-supplies\form\TankEmployee.tsx`
- `src\components\fuel-supplies\form\QuantityAndPrice.tsx`
- `src\components\fuel-supplies\form\DeliveryDateProvider.tsx`
- `src\components\fuel-supplies\form\CommentsField.tsx`

### Directory: src\components\fuel-supplies\summary

- `src\components\fuel-supplies\summary\FuelSuppliesSummary.tsx`

### Directory: src\components\petrol-providers

- `src\components\petrol-providers\ProviderManagerStandardized.tsx`
- `src\components\petrol-providers\ProviderDialogStandardized.tsx`
- `src\components\petrol-providers\DeleteConfirmDialogStandardized.tsx`

### Directory: src\components\settings

- `src\components\settings\SessionLogoutDialogStandardized.tsx`
- `src\components\settings\ProfileFormStandardized.tsx`
- `src\components\settings\ProfileDialogStandardized.tsx`
- `src\components\settings\ProfileController.tsx`

### Directory: src\components\shared

- `src\components\shared\PaymentMethodFormStandardized.tsx`
- `src\components\shared\MultiPaymentMethodFormStandardized.tsx`
- `src\components\shared\InvoiceFormStandardized.tsx`

### Directory: src\components\shifts

- `src\components\shifts\PaymentDetailsDialogStandardized.tsx`

### Directory: src\components\sidebar

- `src\components\sidebar\SidebarNavSection.tsx`
- `src\components\sidebar\SidebarLogo.tsx`
- `src\components\sidebar\SidebarFooter.tsx`

### Directory: src\components\todo

- `src\components\todo\TodoListStandardized.tsx`
- `src\components\todo\TodoList.tsx`
- `src\components\todo\TodoItemStandardized.tsx`
- `src\components\todo\TodoItem.tsx`
- `src\components\todo\TodoFormStandardized.tsx`
- `src\components\todo\TodoFilterStandardized.tsx`
- `src\components\todo\TodoFilter.tsx`

### Directory: src\components\transactions

- `src\components\transactions\TransactionsTable.tsx`
- `src\components\transactions\TransactionsManagerStandardized.tsx`
- `src\components\transactions\TransactionsHeader.tsx`
- `src\components\transactions\TransactionsDialogsStandardized.tsx`
- `src\components\transactions\TransactionListStandardized.tsx`
- `src\components\transactions\TransactionHeader.tsx`
- `src\components\transactions\TransactionDialogStandardized.tsx`

### Directory: src\components\ui

- `src\components\ui\visually-hidden.tsx`
- `src\components\ui\tooltip.tsx`
- `src\components\ui\toggle.tsx`
- `src\components\ui\toggle-group.tsx`
- `src\components\ui\toggle-button.tsx`
- `src\components\ui\toggle-button-group.tsx`
- `src\components\ui\toaster.tsx`
- `src\components\ui\toast.tsx`
- `src\components\ui\toast-container.tsx`
- `src\components\ui\ThemeSwitcher.tsx`
- `src\components\ui\textarea.tsx`
- `src\components\ui\tabs.tsx`
- `src\components\ui\table.tsx`
- `src\components\ui\switch.tsx`
- `src\components\ui\spinner.tsx`
- `src\components\ui\sonner.tsx`
- `src\components\ui\slider.tsx`
- `src\components\ui\skip-to-content.tsx`
- `src\components\ui\skeleton.tsx`
- `src\components\ui\sidebar-shortcuts.tsx`
- `src\components\ui\sidebar-section.tsx`
- `src\components\ui\sheet.tsx`
- `src\components\ui\separator.tsx`
- `src\components\ui\select.tsx`
- `src\components\ui\SearchBar.tsx`
- `src\components\ui\scroll-area.tsx`
- `src\components\ui\resizable.tsx`
- `src\components\ui\radio-group.tsx`
- `src\components\ui\progress.tsx`
- `src\components\ui\popover.tsx`
- `src\components\ui\pagination.tsx`
- `src\components\ui\page-header.tsx`
- `src\components\ui\navigation-menu.tsx`
- `src\components\ui\nav-item.tsx`
- `src\components\ui\multi-select.tsx`
- `src\components\ui\menubar.tsx`
- `src\components\ui\loading.tsx`
- `src\components\ui\loading-button.tsx`
- `src\components\ui\language-switcher.tsx`
- `src\components\ui\label.tsx`
- `src\components\ui\keyboard-shortcut.tsx`
- `src\components\ui\input.tsx`
- `src\components\ui\input-otp.tsx`
- `src\components\ui\icon-button.tsx`
- `src\components\ui\hover-card.tsx`
- `src\components\ui\header.tsx`
- `src\components\ui\header-breadcrumb.tsx`
- `src\components\ui\form.tsx`
- `src\components\ui\dropdown-menu.tsx`
- `src\components\ui\drawer.tsx`
- `src\components\ui\dialog.tsx`
- `src\components\ui\date-range-picker.tsx`
- `src\components\ui\data-table.tsx`
- `src\components\ui\currency-input.tsx`
- `src\components\ui\create-button.tsx`
- `src\components\ui\context-menu.tsx`
- `src\components\ui\command.tsx`
- `src\components\ui\color-contrast-checker.tsx`
- `src\components\ui\collapsible.tsx`
- `src\components\ui\checkbox.tsx`
- `src\components\ui\chart.tsx`
- `src\components\ui\carousel.tsx`
- `src\components\ui\card.tsx`
- `src\components\ui\calendar.tsx`
- `src\components\ui\ButtonShowcase.tsx`
- `src\components\ui\button.tsx`
- `src\components\ui\button-group.tsx`
- `src\components\ui\breadcrumb.tsx`
- `src\components\ui\badge.tsx`
- `src\components\ui\avatar.tsx`
- `src\components\ui\aspect-ratio.tsx`
- `src\components\ui\alert.tsx`
- `src\components\ui\alert-dialog.tsx`
- `src\components\ui\action-button.tsx`
- `src\components\ui\accordion.tsx`

### Directory: src\components\ui\composed

- `src\components\ui\composed\supabase-connection-status.tsx`
- `src\components\ui\composed\StandardizedForm.tsx`
- `src\components\ui\composed\form-fields.tsx`
- `src\components\ui\composed\error-handler.tsx`
- `src\components\ui\composed\dialog.tsx`
- `src\components\ui\composed\dev-menu.tsx`
- `src\components\ui\composed\data-table.tsx`
- `src\components\ui\composed\connectivity-debugger.tsx`
- `src\components\ui\composed\cards.tsx`

### Directory: src\components\ui\primitives

- `src\components\ui\primitives\table.tsx`
- `src\components\ui\primitives\page-header.tsx`
- `src\components\ui\primitives\dialog.tsx`
- `src\components\ui\primitives\card.tsx`
- `src\components\ui\primitives\button.tsx`

### Directory: src\components\ui\styled

- `src\components\ui\styled\dialog.tsx`

### Directory: src\components\unified

- `src\components\unified\StandardizedDataTable.tsx`

### Directory: src\core\providers

- `src\core\providers\theme-provider.tsx`
- `src\core\providers\ErrorBoundary.tsx`
- `src\core\providers\BreadcrumbProvider.tsx`
- `src\core\providers\BreadcrumbPageWrapper.tsx`

### Directory: src\features\auth\components

- `src\features\auth\components\SessionLogoutDialogStandardized.tsx`
- `src\features\auth\components\RegisterForm.tsx`
- `src\features\auth\components\ProfileFormStandardized.tsx`
- `src\features\auth\components\ProfileDialogStandardized.tsx`
- `src\features\auth\components\ProfileController.tsx`
- `src\features\auth\components\PasswordReset.tsx`
- `src\features\auth\components\LoginForm.tsx`
- `src\features\auth\components\AuthProvider.tsx`
- `src\features\auth\components\AuthGuard.tsx`

### Directory: src\features\dashboard\components

- `src\features\dashboard\components\SalesSummaryWidgetStandardized.tsx`
- `src\features\dashboard\components\RevenueInsights.tsx`
- `src\features\dashboard\components\RevenueExpensesChart.tsx`
- `src\features\dashboard\components\ProfitLossChart.tsx`
- `src\features\dashboard\components\MetricsCardsStandardized.tsx`
- `src\features\dashboard\components\IncomeExpenseOverview.tsx`
- `src\features\dashboard\components\FuelLevelVisualizationStandardized.tsx`
- `src\features\dashboard\components\FuelDistributionChart.tsx`
- `src\features\dashboard\components\DashboardOverviewStandardized.tsx`
- `src\features\dashboard\components\DashboardMetrics.tsx`

### Directory: src\features\employees\components

- `src\features\employees\components\EmployeesTable.tsx`
- `src\features\employees\components\EmployeeManagerStandardized.tsx`
- `src\features\employees\components\EmployeeList.tsx`
- `src\features\employees\components\EmployeeHeader.tsx`
- `src\features\employees\components\EmployeeDialogStandardized.tsx`
- `src\features\employees\components\DeleteConfirmDialogStandardized.tsx`

### Directory: src\features\filling-systems\components

- `src\features\filling-systems\components\TankDiagnostics.tsx`
- `src\features\filling-systems\components\FillingSystemManagerStandardized.tsx`
- `src\features\filling-systems\components\FillingSystemList.tsx`
- `src\features\filling-systems\components\FillingSystemHeader.tsx`
- `src\features\filling-systems\components\FillingSystemFormStandardized.tsx`
- `src\features\filling-systems\components\ConfirmDeleteDialogStandardized.tsx`

### Directory: src\features\finance\components

- `src\features\finance\components\TransactionsTable.tsx`
- `src\features\finance\components\TransactionsManagerStandardized.tsx`
- `src\features\finance\components\TransactionsHeader.tsx`
- `src\features\finance\components\TransactionsDialogsStandardized.tsx`
- `src\features\finance\components\TransactionListStandardized.tsx`
- `src\features\finance\components\TransactionHeader.tsx`
- `src\features\finance\components\TransactionDialogStandardized.tsx`
- `src\features\finance\components\ProfitLossManagerStandardized.tsx`
- `src\features\finance\components\PaymentDetailsDialogStandardized.tsx`
- `src\features\finance\components\FinancialDashboardStandardized.tsx`
- `src\features\finance\components\FinanceManagerStandardized.tsx`
- `src\features\finance\components\FinanceFiltersStandardized.tsx`
- `src\features\finance\components\ExpensesTable.tsx`
- `src\features\finance\components\ExpensesManagerStandardized.tsx`
- `src\features\finance\components\ExpensesFormStandardized.tsx`
- `src\features\finance\components\ExpenseManagerStandardized.tsx`
- `src\features\finance\components\ExpenseDialogStandardized.tsx`
- `src\features\finance\components\CategoryManagerStandardized.tsx`

### Directory: src\features\fuel-sales\components

- `src\features\fuel-sales\components\FuelSalesTable.tsx`
- `src\features\fuel-sales\components\FuelSalesStatusUpdate.tsx`
- `src\features\fuel-sales\components\FuelSalesManagerStandardized.tsx`
- `src\features\fuel-sales\components\FuelSalesFormStandardized.tsx`
- `src\features\fuel-sales\components\FuelSalesFilter.tsx`
- `src\features\fuel-sales\components\ConfirmDeleteDialogStandardized.tsx`

### Directory: src\features\fuel-sales\components\summary

- `src\features\fuel-sales\components\summary\FuelSalesSummary.tsx`

### Directory: src\features\fuel-supplies\components

- `src\features\fuel-supplies\components\FuelSuppliesTable.tsx`
- `src\features\fuel-supplies\components\FuelSuppliesSearchBar.tsx`
- `src\features\fuel-supplies\components\FuelSuppliesRangesFilters.tsx`
- `src\features\fuel-supplies\components\FuelSuppliesProviderSelect.tsx`
- `src\features\fuel-supplies\components\FuelSuppliesManagerStandardized.tsx`
- `src\features\fuel-supplies\components\FuelSuppliesHeader.tsx`
- `src\features\fuel-supplies\components\FuelSuppliesFormStandardized.tsx`
- `src\features\fuel-supplies\components\FuelSuppliesFilters.tsx`
- `src\features\fuel-supplies\components\FuelSuppliesDebugger.tsx`
- `src\features\fuel-supplies\components\FuelSuppliesDatePicker.tsx`
- `src\features\fuel-supplies\components\ConfirmDeleteDialogStandardized.tsx`
- `src\features\fuel-supplies\components\ConfirmAddDialogStandardized.tsx`

### Directory: src\features\fuel-supplies\components\summary

- `src\features\fuel-supplies\components\summary\FuelSuppliesSummary.tsx`

### Directory: src\features\fuel\components

- `src\features\fuel\components\FuelTankCard.tsx`
- `src\features\fuel\components\FuelSupplyList.tsx`
- `src\features\fuel\components\FuelSaleList.tsx`
- `src\features\fuel\components\FuelManagementDashboard.tsx`

### Directory: src\features\petrol-providers\components

- `src\features\petrol-providers\components\ProviderManagerStandardized.tsx`
- `src\features\petrol-providers\components\ProviderDialogStandardized.tsx`
- `src\features\petrol-providers\components\DeleteConfirmDialogStandardized.tsx`

### Directory: src\features\sales\components

- `src\features\sales\components\TankFormDialogStandardized.tsx`
- `src\features\sales\components\ShiftControl.tsx`
- `src\features\sales\components\SalesTable.tsx`
- `src\features\sales\components\SalesSystemSelect.tsx`
- `src\features\sales\components\SalesSearchBar.tsx`
- `src\features\sales\components\SalesRangesFilters.tsx`
- `src\features\sales\components\SalesHeader.tsx`
- `src\features\sales\components\SalesFormStandardized.tsx`
- `src\features\sales\components\SalesFilters.tsx`
- `src\features\sales\components\SalesFilterPanel.tsx`
- `src\features\sales\components\SalesDialogsStandardized.tsx`
- `src\features\sales\components\SalesDatePicker.tsx`
- `src\features\sales\components\SalesController.tsx`
- `src\features\sales\components\NewSaleButton.tsx`
- `src\features\sales\components\FillingSystemSelect.tsx`

### Directory: src\features\sales\components\form

- `src\features\sales\components\form\PriceAndEmployeeInputs.tsx`
- `src\features\sales\components\form\FillingSystemSelect.tsx`

### Directory: src\features\supplies\components

- `src\features\supplies\components\SuppliesTable.tsx`
- `src\features\supplies\components\SuppliesDashboard.tsx`
- `src\features\supplies\components\KpiCardGrid.tsx`

### Directory: src\features\tanks\components

- `src\features\tanks\components\TankManager.tsx`
- `src\features\tanks\components\TankList.tsx`
- `src\features\tanks\components\TankLevelEditor.tsx`
- `src\features\tanks\components\TankHistory.tsx`
- `src\features\tanks\components\TankFormDialog.tsx`
- `src\features\tanks\components\TankController.tsx`

### Directory: src\features\todo\components

- `src\features\todo\components\TodoListStandardized.tsx`
- `src\features\todo\components\TodoList.tsx`
- `src\features\todo\components\TodoItemStandardized.tsx`
- `src\features\todo\components\TodoItem.tsx`
- `src\features\todo\components\TodoFormStandardized.tsx`
- `src\features\todo\components\TodoFilterStandardized.tsx`
- `src\features\todo\components\TodoFilter.tsx`

### Directory: src\hooks

- `src\hooks\usePageBreadcrumbs.tsx`
- `src\hooks\useBreadcrumbs.tsx`
- `src\hooks\useAuth.tsx`
- `src\hooks\use-keyboard-navigation.tsx`

### Directory: src\layouts

- `src\layouts\Sidebar.tsx`
- `src\layouts\PageLayout.tsx`
- `src\layouts\MainLayout.tsx`
- `src\layouts\AdminShell.tsx`

### Directory: src\pages

- `src\pages\Transactions.tsx`
- `src\pages\SyncUpPage.tsx`
- `src\pages\Settings.tsx`
- `src\pages\PetrolProviders.tsx`
- `src\pages\NotFound.tsx`
- `src\pages\Index.tsx`
- `src\pages\FuelManagement.tsx`
- `src\pages\fuel-management.tsx`
- `src\pages\form-showcase.tsx`
- `src\pages\Expenses.tsx`
- `src\pages\EmployeesNew.tsx`
- `src\pages\DebugPage.tsx`
- `src\pages\DashboardNew.tsx`
- `src\pages\Auth.tsx`

### Directory: src\pages\dashboards

- `src\pages\dashboards\DashboardPage.tsx`

### Directory: src\pages\dev

- `src\pages\dev\ToastTester.tsx`
- `src\pages\dev\ResponsiveTestPage.tsx`
- `src\pages\dev\index.tsx`
- `src\pages\dev\DevTools.tsx`
- `src\pages\dev\ConnectionInfo.tsx`
- `src\pages\dev\CardComponentsPage.tsx`
- `src\pages\dev\ButtonComponentsPage.tsx`

### Directory: src\pages\employees

- `src\pages\employees\EmployeesPage.tsx`

### Directory: src\pages\expenses

- `src\pages\expenses\ExpensesPage.tsx`

### Directory: src\pages\finance

- `src\pages\finance\FinancePage.tsx`
- `src\pages\finance\FinanceDashboard.tsx`
- `src\pages\finance\ExpensesPage.tsx`
- `src\pages\finance\ExpenseForm.tsx`
- `src\pages\finance\ExpenseCreate.tsx`

### Directory: src\pages\fuel-management

- `src\pages\fuel-management\TanksPage.tsx`
- `src\pages\fuel-management\ProvidersPage.tsx`
- `src\pages\fuel-management\FuelSuppliesPage.tsx`
- `src\pages\fuel-management\FuelPricesPage.tsx`
- `src\pages\fuel-management\FuelManagementDashboard.tsx`
- `src\pages\fuel-management\FillingSystemsPage.tsx`

### Directory: src\pages\fuel-management\components

- `src\pages\fuel-management\components\ConsumptionChart.tsx`

### Directory: src\pages\fuel-supplies

- `src\pages\fuel-supplies\FuelSupplyCreate.tsx`
- `src\pages\fuel-supplies\FuelSuppliesPage.tsx`
- `src\pages\fuel-supplies\FuelSuppliesForm.tsx`

### Directory: src\pages\sales

- `src\pages\sales\SalesPage.tsx`
- `src\pages\sales\SalesNew.tsx`
- `src\pages\sales\SalesCreate.tsx`

### Directory: src\pages\settings

- `src\pages\settings\SecuritySettings.tsx`
- `src\pages\settings\ProfileSettings.tsx`
- `src\pages\settings\PrivacySettings.tsx`
- `src\pages\settings\NotificationsSettings.tsx`
- `src\pages\settings\NotificationSettings.tsx`
- `src\pages\settings\index.tsx`
- `src\pages\settings\AppearanceSettings.tsx`
- `src\pages\settings\AccountSettings.tsx`

### Directory: src\pages\shifts

- `src\pages\shifts\ShiftsPage.tsx`
- `src\pages\shifts\Shifts.tsx`
- `src\pages\shifts\ShiftOpen.tsx`
- `src\pages\shifts\ShiftDetails.tsx`
- `src\pages\shifts\ShiftClose.tsx`

### Directory: src\shared\components\common\dialog

- `src\shared\components\common\dialog\StandardDialog.tsx`
- `src\shared\components\common\dialog\DeleteConfirmDialog.tsx`

### Directory: src\shared\components\dev

- `src\shared\components\dev\DeprecationTracker.tsx`

### Directory: src\utils

- `src\utils\performance.tsx`

## Next Steps

1. Move core UI components to `src/core/components`
2. Move remaining feature components to their respective feature directories
3. Move shared utility components to `src/shared/components`
4. Review uncategorized components manually
5. Update imports across the codebase
6. Create bridge components for backward compatibility

## Implementation Plan

1. Start by moving the core components
2. Then move the feature components
3. Finally move the shared components
4. Address the uncategorized components after manual review
