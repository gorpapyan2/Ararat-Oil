# Hooks Architecture Guide

## Overview

This document explains the hooks architecture implemented in the Ararat OIL project. The architecture is designed to:

1. **Eliminate code duplication** across feature-specific hooks
2. **Standardize patterns** for common operations like dialogs, forms, and data fetching
3. **Improve maintainability** by creating a clear hierarchy of hooks
4. **Enhance developer experience** by providing a consistent, intuitive API

## Hook Structure

Our hooks follow a layered architecture:

```
src/
├── shared/                     # Cross-cutting concerns
│   ├── hooks/                  # Shared hooks foundation
│   │   ├── base/               # Base hooks (templates for feature hooks)
│   │   │   ├── useBaseDialog.ts
│   │   │   ├── useEntityDialog.ts
│   │   │   └── types.ts
│   │   ├── form/               # Form-related hooks
│   │   │   ├── useZodForm.ts
│   │   │   ├── useFormValidation.ts
│   │   │   ├── useCommonValidation.ts
│   │   │   └── useFormSubmitHandler.ts
│   │   └── index.ts
├── features/                   # Feature modules
│   ├── [feature-name]/         # e.g., employees, sales, etc.
│   │   ├── hooks/              # Feature-specific hooks
│   │   │   ├── use[Feature]Dialog.ts
│   │   │   └── ...
```

## Base Hooks

### Dialog Hooks

#### `useBaseDialog`

Provides core dialog functionality with a clean, consistent API:

```typescript
const dialog = useBaseDialog<EntityType>({
  onClose: () => console.log("Dialog closed"),
  onSuccess: (result) => console.log("Operation succeeded", result),
  onError: (error) => console.error("Operation failed", error)
});

// Properties
dialog.isOpen         // Dialog open state
dialog.isSubmitting   // Loading state
dialog.entity         // Current entity being edited/viewed

// Methods
dialog.open()         // Open the dialog
dialog.close()        // Close the dialog
dialog.onOpenChange() // Handle dialog open state change
dialog.reset()        // Reset dialog state
```

#### `useEntityDialog`

Extends `useBaseDialog` to provide CRUD operation support:

```typescript
const dialog = useEntityDialog<EntityType>({
  entityName: "entity",
  onCreateSuccess: (entity) => console.log("Entity created", entity),
  onUpdateSuccess: (entity) => console.log("Entity updated", entity),
  onDeleteSuccess: (id) => console.log("Entity deleted", id)
});

// Properties
dialog.isCreateMode   // Whether dialog is in create mode
dialog.isEditMode     // Whether dialog is in edit mode

// Methods
dialog.openCreate()   // Open dialog in create mode
dialog.openEdit(entity) // Open dialog in edit mode with entity
```

## Form Validation Hooks

### `useZodForm`

Integrates React Hook Form with Zod validation:

```typescript
const form = useZodForm({
  schema: myZodSchema,
  defaultValues: { name: "" }
});
```

### `useFormSubmitHandler`

Handles form submission with loading state and error handling:

```typescript
const { handleSubmit, isSubmitting } = useFormSubmitHandler(form, async (data) => {
  await saveData(data);
}, {
  successMessage: "Data saved successfully",
  errorMessage: "Failed to save data",
  resetOnSuccess: true
});
```

### `useFormValidation`

Combines Zod validation, form handling, and submission in one hook:

```typescript
const { form, handleSubmit, isSubmitting, validation } = useFormValidation({
  schema: myZodSchema,
  onSubmit: async (data) => {
    await saveData(data);
  },
  submitOptions: {
    successMessage: "Data saved successfully",
    resetOnSuccess: true
  }
});
```

## Feature-Specific Hooks

Feature-specific hooks extend the base hooks to add domain-specific functionality while reusing common patterns.

### Example: `useEmployeeDialog`

```typescript
// In src/features/employees/hooks/useEmployeeDialog.ts
export function useEmployeeDialog(options) {
  const dialog = useEntityDialog<Employee>({
    entityName: 'employee',
    ...options,
  });
  
  const handleSubmit = async (data) => {
    dialog.setIsSubmitting(true);
    try {
      // Employee-specific logic...
      
      if (dialog.isCreateMode) {
        // Create employee logic
      } else {
        // Update employee logic
      }
    } catch (error) {
      // Error handling
    } finally {
      dialog.setIsSubmitting(false);
    }
  };
  
  return {
    ...dialog,
    handleSubmit,
  };
}
```

## Usage in Components

The hooks architecture simplifies component implementation:

```tsx
function EmployeeManager() {
  const employeeDialog = useEmployeeDialog({
    onCreateSuccess: (employee) => console.log("Employee created", employee),
    onUpdateSuccess: (employee) => console.log("Employee updated", employee)
  });
  
  return (
    <div>
      <Button onClick={employeeDialog.openCreate}>Add Employee</Button>
      
      <EmployeeDialog
        open={employeeDialog.isOpen}
        onOpenChange={employeeDialog.onOpenChange}
        employee={employeeDialog.entity}
        onSubmit={employeeDialog.handleSubmit}
        isSubmitting={employeeDialog.isSubmitting}
      />
    </div>
  );
}
```

## Benefits

1. **Reduced Code Duplication**: Common patterns are extracted to base hooks
2. **Type Safety**: Full TypeScript support with proper generics
3. **Consistent UX**: Standardized loading states, error handling, and success feedback
4. **Developer Experience**: Intuitive API that is easy to learn and use
5. **Maintainability**: Clear separation of concerns and predictable patterns

## Best Practices

1. **Always extend base hooks** for feature-specific functionality
2. **Keep feature-specific logic in feature directories**
3. **Use the most specific hook** for your needs
4. **Consistent naming conventions**:
   - `use[Feature]Dialog` for dialog hooks
   - `use[Feature]Form` for form hooks
   - `use[Feature]Query` for data fetching hooks
5. **Export feature hooks** through feature `index.ts` files
