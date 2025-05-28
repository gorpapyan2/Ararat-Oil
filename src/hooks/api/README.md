# API Hooks System

This directory contains a standardized system for data fetching and mutation operations. It provides a consistent API for interacting with backend services while maintaining proper TypeScript type safety and cache management.

## Core Hooks

### useApiQuery

A standardized hook for data fetching operations.

```tsx
const employees = useApiQuery({
  queryKey: ["employees", filters],
  queryFn: () => employeeService.getEmployees(filters),
  filters,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Use the standardized result
if (employees.isLoading) return <Loading />;
if (employees.isError) return <Error error={employees.error} />;
return <EmployeeList data={employees.data} />;
```

### useApiMutation

A standardized hook for data mutation operations with built-in cache invalidation.

```tsx
const createEmployee = useApiMutation({
  mutationFn: (data) => employeeService.createEmployee(data),
  invalidateQueries: ["employees"],
  onSuccessCallback: (data, variables, context, queryClient) => {
    // Additional success handling
    toast.success("Employee created successfully");
  },
});

// Usage in component
const handleSubmit = (data) => {
  createEmployee.mutate(data);
};
```

### useApiInfiniteQuery

A standardized hook for paginated data fetching.

```tsx
const productsQuery = useApiInfiniteQuery({
  queryKey: ["products", filters],
  queryFn: (pageParam) =>
    productService.getProducts({ ...filters, page: pageParam }),
  filters,
  getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
});

return (
  <ProductList
    data={productsQuery.flatData}
    hasMore={productsQuery.hasNextPage}
    loadMore={productsQuery.loadMore}
    isLoadingMore={productsQuery.isFetchingNextPage}
  />
);
```

## Resource Hooks Factory

The `createResourceHooks` function creates a complete set of standardized hooks for a resource.

```tsx
// Define your service implementation
const employeeService = {
  getList: getEmployees,
  getById: getEmployeeById,
  create: createEmployee,
  update: updateEmployee,
  delete: deleteEmployee,
  getSummary: getEmployeeSummary,
};

// Create hooks using the factory
const {
  useList: useEmployees,
  useById: useEmployeeById,
  useCreate: useCreateEmployee,
  useUpdate: useUpdateEmployee,
  useDelete: useDeleteEmployee,
  useSummary: useEmployeeSummary,
} = createResourceHooks({
  resourceName: "employees",
  service: employeeService,
});
```

## Cache Utilities

The `cache-utils.ts` file provides standardized utilities for managing the React Query cache:

```tsx
// Create standard query keys
const keys = createQueryKeys("employees");

// Standard cache invalidation helpers
const invalidations = createInvalidations(queryClient, "employees");
invalidations.invalidateAll(); // Invalidate all employee-related queries
```

## Migration Guide

For detailed instructions on migrating existing feature hooks to the new system, please refer to the `docs/feature-hook-refactoring-guide.md` documentation.
