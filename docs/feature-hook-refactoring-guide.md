# Feature Hook Refactoring Guide

This guide provides step-by-step instructions for refactoring feature hooks to use the new standardized API hooks system. Following these practices will reduce code duplication, ensure consistent API design, and improve maintainability across the application.

## Table of Contents

- [Overview](#overview)
- [Benefits](#benefits)
- [Migration Strategy](#migration-strategy)
- [Step-by-Step Refactoring](#step-by-step-refactoring)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The new API hooks system provides a standardized way to interact with APIs and manage cache invalidation. It consists of three core hooks:

- `useApiQuery`: For fetching data
- `useApiMutation`: For creating, updating, or deleting data
- `useApiInfiniteQuery`: For paginated data

And a resource hooks factory:

- `createResourceHooks`: Creates a complete set of hooks for a resource (list, getById, create, update, delete, etc.)

## Benefits

- **Reduced Duplication**: Eliminate repetitive code across feature hooks
- **Consistent API Design**: Standardized return values and naming conventions
- **Simplified Cache Management**: Consistent cache invalidation strategies 
- **Better Type Safety**: Properly typed hooks with TypeScript
- **Easier Testing**: Consistent patterns make testing simpler
- **Reduced Bundle Size**: Less duplicate code means smaller bundles

## Migration Strategy

We recommend a gradual, feature-by-feature migration approach:

1. **Phase 1**: Create wrapper hooks that use the new system internally but maintain the old API
2. **Phase 2**: Update components to use the new API directly where possible
3. **Phase 3**: Add deprecation notices to old hooks and eventually remove them

This approach ensures that:
- Existing functionality continues to work during the migration
- You can migrate individual features without breaking others
- You can test each migrated feature thoroughly

## Step-by-Step Refactoring

### 1. Prepare the Service Implementation

First, adapt your existing service functions to the required interface:

```typescript
// Define the service implementation
const resourceService = {
  getList: (filters) => ...,    // Required
  getById: (id) => ...,         // Required
  create: (data) => ...,        // Required
  update: (id, data) => ...,    // Required
  delete: (id) => ...,          // Required
  getSummary: () => ...         // Optional
};
```

### 2. Create Resource Hooks

Use the factory to create all hooks at once:

```typescript
const {
  useList,
  useById,
  useCreate,
  useUpdate,
  useDelete,
  useSummary
} = createResourceHooks<ResourceType, FiltersType, CreateDataType, UpdateDataType>({
  resourceName: 'resourceName',
  service: resourceService,
  options: {
    staleTime: 5 * 60 * 1000, // 5 minutes
  }
});
```

### 3. Rename the Hooks (Optional)

For clarity and consistency with your feature naming:

```typescript
const {
  useList: useResourcesList,
  useById: useResourceById,
  useCreate: useCreateResource,
  useUpdate: useUpdateResource,
  useDelete: useDeleteResource,
  useSummary: useResourceSummary
} = createResourceHooks({ ... });
```

### 4. Create Backward Compatible Hook (If Needed)

To maintain compatibility with existing code:

```typescript
export function useResources(filters) {
  const list = useResourcesList(filters);
  const summary = useResourceSummary();
  
  return {
    // Match the old API structure
    resources: list.data || [],
    isLoading: list.isLoading,
    // ... other properties
  };
}
```

### 5. Export Both Old and New Hooks

```typescript
// Main export (backward compatible)
export { useResources };

// New hooks for direct usage
export {
  useResourcesList,
  useResourceById,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
  useResourceSummary
};
```

### 6. Update Components

Gradually update components to use the new hooks:

```tsx
// Before
const { resources, isLoading } = useResources();

// After - option 1 (using backward compatible hook)
const { resources, isLoading } = useResources();

// After - option 2 (using new hooks directly)
const { data: resources, isLoading } = useResourcesList();
```

## Examples

### Original Implementation

```typescript
// Original implementation with duplicated patterns
export function useEmployees(filters) {
  const queryClient = useQueryClient();

  const employees = useQuery({
    queryKey: ['employees', filters],
    queryFn: () => getEmployees(filters),
  });

  const createEmployee = useMutation({
    mutationFn: (data) => createEmployeeService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // ... more mutations and queries
  
  return {
    employees: employees.data || [],
    isLoading: employees.isLoading,
    createEmployee,
    // ... other properties
  };
}
```

### Refactored Implementation

```typescript
// Service implementation
const employeeService = {
  getList: getEmployees,
  getById: getEmployeeById,
  create: createEmployeeService,
  update: updateEmployeeService,
  delete: deleteEmployeeService,
  getSummary: getEmployeeSummary
};

// Create hooks using the factory
const {
  useList: useEmployeesList,
  useById: useEmployeeById,
  useCreate: useCreateEmployee,
  useUpdate: useUpdateEmployee,
  useDelete: useDeleteEmployee,
  useSummary: useEmployeeSummary
} = createResourceHooks({
  resourceName: 'employees',
  service: employeeService
});

// Backward compatible hook
export function useEmployees(filters) {
  const employees = useEmployeesList(filters);
  const createEmployeeMutation = useCreateEmployee();
  
  return {
    employees: employees.data || [],
    isLoading: employees.isLoading,
    createEmployee: createEmployeeMutation,
    // ... other properties
  };
}

// Export new hooks
export {
  useEmployeesList,
  useEmployeeById,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useEmployeeSummary
};
```

## Best Practices

### TypeScript Usage

Always provide proper type parameters to `createResourceHooks`:

```typescript
createResourceHooks<
  Employee,             // The resource type
  EmployeeFilters,      // Filters type
  EmployeeFormData,     // Create data type
  EmployeeFormData      // Update data type
>({ ... });
```

### Query Key Management

Use consistent query keys. The factory handles this for you, but for direct `useApiQuery` usage:

```typescript
useApiQuery({
  queryKey: ['employees', filters],  // Use array format
  // ... other options
});
```

### Cache Invalidation

For custom hooks, use the cache utilities:

```typescript
import { invalidateQueries, createQueryKeys } from '@/hooks/api';

const keys = createQueryKeys('employees');
invalidateQueries(queryClient, [keys.all]);
```

### Custom Success Handlers

Use `onSuccessCallback` for custom logic:

```typescript
useApiMutation({
  // ... other options
  onSuccessCallback: (data, variables, context, queryClient) => {
    // Custom logic here
    toast.success('Employee created successfully');
  }
});
```

## Troubleshooting

### Common Issues

1. **Cache Invalidation Not Working**
   - Check that query keys are consistent
   - Ensure invalidation is happening after mutation completes

2. **Type Errors**
   - Make sure all generic type parameters are provided
   - Verify that service implementation matches the required interface

3. **Data Not Updated in UI**
   - Check if you're using `.data` property from the hook result
   - Verify that components are responding to query state changes

### Getting Help

If you encounter issues during migration:

1. Check the examples in `src/features/employees/hooks/useEmployees-refactored.ts`
2. Review the API documentation in JSDoc comments
3. Reach out to the architecture team for assistance 