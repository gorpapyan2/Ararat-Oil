# I18n Migration Guide

## Overview

This guide explains how to use the standardized API translation helpers introduced as part of the core API refactoring. These helpers provide a consistent way to handle translated messages for API-related operations.

## API Translation Helpers

The API translation helpers are located in `src/i18n/api-translations.ts` and are exported from `src/i18n/i18n.ts`.

### Available Helpers

- `apiNamespaces`: An object containing namespace constants for API modules
- `getApiErrorMessage`: Returns translated error messages for API operations
- `getApiSuccessMessage`: Returns translated success messages for API operations
- `getApiActionLabel`: Returns translated labels for API-related actions

## How to Use

### Importing the Helpers

```typescript
import { 
  apiNamespaces, 
  getApiErrorMessage, 
  getApiSuccessMessage, 
  getApiActionLabel 
} from '@/i18n/i18n';
```

### Error Messages

Use `getApiErrorMessage` to get translated error messages for API operations:

```typescript
// When an API error occurs
try {
  await employeesApi.createEmployee(employeeData);
} catch (error) {
  toast({
    title: t("common.error"),
    description: getApiErrorMessage('employees', 'create'),
    variant: "destructive",
  });
}

// With custom entity name
const errorMessage = getApiErrorMessage('employees', 'delete', 'manager');
// Returns a message like "Failed to delete manager"
```

### Success Messages

Use `getApiSuccessMessage` to get translated success messages:

```typescript
// When an API operation succeeds
const result = await expensesApi.createExpense(expenseData);
if (result.data) {
  toast({
    title: t("common.success"),
    description: getApiSuccessMessage('expenses', 'create'),
  });
}
```

### Action Labels

Use `getApiActionLabel` to get translated labels for buttons and actions:

```typescript
// For a button label
<Button onClick={handleCreate}>
  {getApiActionLabel('sales', 'create')}
</Button>

// For a header title
<CardTitle>{getApiActionLabel('fuelSupplies', 'list')}</CardTitle>
```

## Translation Structure

The API translation helpers look for translations in the following structure:

### Error Messages

```json
{
  "errors": {
    "employees": {
      "createFailed": "Failed to create employee",
      "updateFailed": "Failed to update employee",
      "getFailed": "Failed to fetch employee details",
      "deleteFailed": "Failed to delete employee",
      "fetchFailed": "Failed to fetch employees"
    }
  }
}
```

### Success Messages

```json
{
  "success": {
    "employees": {
      "createSuccess": "Employee created successfully",
      "updateSuccess": "Employee updated successfully",
      "deleteSuccess": "Employee deleted successfully"
    }
  }
}
```

### Action Labels

```json
{
  "actions": {
    "employees": {
      "create": "Create Employee",
      "update": "Update Employee",
      "delete": "Delete Employee",
      "view": "View Employee Details",
      "list": "Employee List",
      "filter": "Filter Employees"
    }
  }
}
```

## Fallback Behavior

If a translation is not available, the helper functions will return a sensible default message based on the module name, operation, and (if provided) entity name.

For example, if a translation for `errors.expenses.createFailed` is not available, `getApiErrorMessage('expenses', 'create')` will return "Failed to create expenses".

## Adding New Translations

To add new translations:

1. Add entries to the translation files (`src/i18n/locales/en/translation.json` and `src/i18n/locales/hy/translation.json`)
2. Follow the structure shown above

## Migration Steps

To migrate a component to use the API translation helpers:

1. Import the helpers
2. Replace hardcoded error messages with `getApiErrorMessage`
3. Replace hardcoded success messages with `getApiSuccessMessage`
4. Replace hardcoded action labels with `getApiActionLabel`

### Example Migration

**Before:**

```typescript
try {
  await salesApi.createSale(saleData);
  toast({
    title: "Success",
    description: "Sale created successfully",
  });
} catch (error) {
  toast({
    title: "Error",
    description: "Failed to create sale",
    variant: "destructive",
  });
}

// Button label
<Button onClick={handleCreateSale}>Create Sale</Button>
```

**After:**

```typescript
try {
  await salesApi.createSale(saleData);
  toast({
    title: t("common.success"),
    description: getApiSuccessMessage('sales', 'create'),
  });
} catch (error) {
  toast({
    title: t("common.error"),
    description: getApiErrorMessage('sales', 'create'),
    variant: "destructive",
  });
}

// Button label
<Button onClick={handleCreateSale}>
  {getApiActionLabel('sales', 'create')}
</Button>
``` 