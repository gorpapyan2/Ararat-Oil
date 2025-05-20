# API Translation Helpers - Quick Reference

## Overview
This quick reference guide covers the API translation helpers used throughout our application. These helpers provide consistent internationalization (i18n) for API-related messages, especially for error and success states.

## API Namespaces

All API-related translations use predefined namespaces:

```typescript
// Available API namespaces
import { apiNamespaces } from "@/i18n/i18n";

// Namespaces match API endpoint names
apiNamespaces.employees    // For employee-related translations
apiNamespaces.sales        // For sales-related translations
apiNamespaces.tanks        // For tank-related translations
apiNamespaces.finances     // For finance-related translations
// ... other namespaces
```

⚠️ **Important**: The namespace must exactly match the API endpoint name (e.g., use `apiNamespaces.finances` not `apiNamespaces.finance`).

## Helper Functions

### Error Messages

Use `getApiErrorMessage` for consistent error messages:

```typescript
import { apiNamespaces, getApiErrorMessage } from "@/i18n/i18n";

// Basic error for a specific operation
const errorMessage = getApiErrorMessage(apiNamespaces.employees, 'create');
// Result (example): "Failed to create employee"

// Error with entity type specified
const specificError = getApiErrorMessage(apiNamespaces.tanks, 'update', 'fuel tank');
// Result (example): "Failed to update fuel tank"

// Error with fetch operation
const fetchError = getApiErrorMessage(apiNamespaces.sales, 'fetch');
// Result (example): "Failed to fetch sales data"
```

### Success Messages

Use `getApiSuccessMessage` for consistent success messages:

```typescript
import { apiNamespaces, getApiSuccessMessage } from "@/i18n/i18n";

// Basic success for a specific operation
const successMessage = getApiSuccessMessage(apiNamespaces.employees, 'create');
// Result (example): "Employee created successfully"

// Success with entity type specified
const specificSuccess = getApiSuccessMessage(apiNamespaces.tanks, 'update', 'fuel tank');
// Result (example): "Fuel tank updated successfully"

// Success with delete operation
const deleteSuccess = getApiSuccessMessage(apiNamespaces.sales, 'delete', 'sale record');
// Result (example): "Sale record deleted successfully"
```

### Action Labels

Use `getApiActionLabel` for action-related labels:

```typescript
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";

// Get label for a list/index action
const listLabel = getApiActionLabel(apiNamespaces.employees, 'list');
// Result (example): "Employees"

// Get label for create action
const createLabel = getApiActionLabel(apiNamespaces.tanks, 'create');
// Result (example): "Create Tank"

// Get label for edit action
const editLabel = getApiActionLabel(apiNamespaces.sales, 'edit');
// Result (example): "Edit Sale"
```

## Integration with Components

### Error Handling in Components

```typescript
import { useToast } from "@/hooks/useToast";
import { apiNamespaces, getApiErrorMessage } from "@/i18n/i18n";

function MyComponent() {
  const { toast } = useToast();
  
  // Error handling with API translation helper
  try {
    // API call here
  } catch (error) {
    toast({
      title: t("common.error"),
      description: getApiErrorMessage(apiNamespaces.employees, 'create'),
      variant: "destructive"
    });
  }
}
```

### Use with React Query

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeApi } from "@/core/api";
import { apiNamespaces, getApiErrorMessage, getApiSuccessMessage } from "@/i18n/i18n";

function EmployeeForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createMutation = useMutation({
    mutationFn: employeeApi.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: t("common.success"),
        description: getApiSuccessMessage(apiNamespaces.employees, 'create', 'employee')
      });
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: getApiErrorMessage(apiNamespaces.employees, 'create', 'employee'),
        variant: "destructive"
      });
    }
  });
}
```

### Fallback Support

Always provide fallback text in components:

```typescript
// In a component
const pageTitle = t("employees.title") || getApiActionLabel(apiNamespaces.employees, 'list');
const pageDescription = t("employees.description") || "Manage employee information";
```

## Supported Operations

The helpers support these operation types:

| Operation | Description | Example |
|-----------|-------------|---------|
| `fetch` | Retrieving data | "Failed to fetch employee data" |
| `create` | Creating new records | "Employee created successfully" |
| `update` | Updating existing records | "Failed to update employee" |
| `delete` | Deleting records | "Employee deleted successfully" |
| `list` | Displaying a list/index | "Employees" |
| `edit` | Editing an entity | "Edit Employee" |
| `view` | Viewing entity details | "View Employee" |

## Best Practices

1. **Always use translation helpers** for API-related messages
2. **Provide entity types** when appropriate for more specific messages
3. **Include fallback text** for when translations are unavailable
4. **Keep translations consistent** across similar operations
5. **Use the correct namespace** that matches the API endpoint name
6. **Add new operation types** to the helper functions when needed
7. **Add translations for new API modules** in the i18n configuration files 