# Feature Hook Standardization Plan

## Current State Analysis

After examining the codebase, we've found several feature-specific hooks that follow similar patterns but with inconsistent implementations. Most features have their own hooks directory with custom implementations for data fetching, mutations, and filtering. This has led to:

1. **Code Duplication**: Similar patterns for query definition, mutation handling, and cache invalidation are repeated across features.
2. **Inconsistent API Design**: Some hooks return objects with properties, others return an array of values, and naming conventions vary.
3. **Varied Error Handling**: Different approaches to error handling and loading states.
4. **Redundant Cache Management**: Each feature implements its own cache invalidation strategy.
5. **Inconsistent TypeScript Usage**: Type definitions and interfaces vary across features.

## Example Patterns Found

From analyzing hooks like `useFuelSales.ts`, `useFuelSupplies.ts`, and `useEmployees.ts`, we've identified these common patterns:

### Data Fetching
- All features use TanStack Query (React Query) with varying configurations
- Query keys defined differently across features
- Stale times and caching strategies vary

### Data Mutations
- All features implement create, update, and delete mutations
- Cache invalidation approaches are similar but duplicated
- Success/error handling varies

### Filtering
- Most features have custom filter interfaces
- Filter handling is duplicated across features

## Standardization Goals

1. **Reduce Duplication**: Create reusable hooks for common patterns
2. **Consistent API Design**: Standardize return values and naming conventions
3. **Unified Error Handling**: Create consistent patterns for handling errors
4. **Centralized Cache Management**: Standardize cache invalidation strategies
5. **Type-Safe Implementation**: Ensure consistent TypeScript usage

## Implementation Plan

### Phase 1: Create Base Hooks

1. **Create Core API Hooks**:
   - `useApiQuery` - Base hook for data fetching with standardized options
   - `useApiMutation` - Base hook for data mutations with standardized cache handling
   - `useApiInfiniteQuery` - Base hook for paginated data

2. **Define Standard Types**:
   - `QueryOptions` - Standardized options for queries
   - `MutationOptions` - Standardized options for mutations
   - `FilterParams` - Base interface for filter parameters

### Phase 2: Create Feature Hook Factory

1. **Create Resource Hook Factory**:
   ```typescript
   function createResourceHooks<TData, TFilters, TCreateData, TUpdateData>({
     resourceName,
     service,
     options
   }) {
     // Returns standardized hooks for a resource
     return {
       useList, // fetch list with filters
       useById, // fetch single item
       useCreate, // create item
       useUpdate, // update item
       useDelete, // delete item
       useSummary, // fetch summary data
     }
   }
   ```

2. **Implement Standard Cache Invalidation**:
   - Create a consistent pattern for cache invalidation across mutations

### Phase 3: Migration Strategy

1. **Migration Path**:
   - Create wrapper hooks that use the new system internally but maintain the old API
   - Gradually update components to use the new API
   - Add deprecation warnings to old hooks

2. **Documentation**:
   - Create comprehensive documentation with examples
   - Add migration guides for each feature

## Proposed Structure

```
src/
  hooks/
    api/
      useApiQuery.ts
      useApiMutation.ts
      useApiInfiniteQuery.ts
      createResourceHooks.ts
      cache-utils.ts
      types.ts
    feature-utils/
      useEntityCrud.ts
      useEntityFilters.ts
      useEntitySummary.ts
```

## Implementation Details

### `useApiQuery` Hook

```typescript
function useApiQuery<TData, TError = Error, TFilters = unknown>({
  queryKey,
  queryFn,
  filters,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes default
  ...options
}: UseApiQueryOptions<TData, TError, TFilters>) {
  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey, filters],
    queryFn,
    enabled,
    staleTime,
    ...options,
  });
}
```

### `useApiMutation` Hook

```typescript
function useApiMutation<TData, TVariables, TError = Error>({
  mutationFn,
  invalidateQueries = [],
  onSuccessCallback,
  ...options
}: UseApiMutationOptions<TData, TVariables, TError>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Standard cache invalidation
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
      });
      
      // Custom success handler
      if (onSuccessCallback) {
        onSuccessCallback(data, variables, context, queryClient);
      }
    },
    ...options,
  });
}
```

### Resource Hook Factory Example

```typescript
// Example usage for employees
const {
  useList: useEmployees,
  useById: useEmployeeById,
  useCreate: useCreateEmployee,
  useUpdate: useUpdateEmployee,
  useDelete: useDeleteEmployee,
  useSummary: useEmployeeSummary
} = createResourceHooks({
  resourceName: 'employees',
  service: employeeService,
  options: {
    staleTime: 5 * 60 * 1000,
  }
});
```

## Success Metrics

- **Duplication Reduction**: Eliminate 90% of duplicate code in feature hooks
- **API Consistency**: All feature hooks follow the same patterns
- **Type Safety**: All hooks properly typed with TypeScript
- **Migration Completion**: All features migrated to new standardized hooks
- **Bundle Size**: Reduced bundle size due to code deduplication

## Timeline

1. **Week 1**: Create base hooks and define standard types
2. **Week 2**: Implement resource hook factory
3. **Week 3**: Migrate first set of features (employees, fuel-sales)
4. **Week 4**: Migrate remaining features and finalize documentation

## Conclusion

This standardization will significantly reduce code duplication and improve maintainability by creating a consistent pattern for feature hooks across the application. The approach provides a smooth migration path while ensuring backward compatibility during the transition. 