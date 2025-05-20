# Hook Standardization Guide

This document outlines the official patterns for React Query hooks in our application, ensuring consistency across all features.

## Core Principles

1. **Consistency**: All hooks should follow the same pattern for similar operations
2. **Type Safety**: All hooks should have proper TypeScript typing
3. **Error Handling**: All hooks should handle errors uniformly
4. **Caching Strategy**: Query invalidation should follow consistent patterns
5. **Naming Conventions**: Hook and returned property names should be consistent

## Official Return Type Pattern

We've decided to standardize on the following pattern for all feature hooks:

### Query Hooks (Read Operations)

```typescript
function useFeatureData(params?: FeatureParams) {
  const queryResult = useQuery<FeatureData, Error>(
    ['featureKey', params],
    () => fetchFeatureData(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    }
  );

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    // Other useful properties
  };
}
```

### Mutation Hooks (Write Operations)

```typescript
function useFeatureMutations() {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation<
    FeatureData,
    Error,
    CreateFeatureRequest
  >(
    (data) => createFeature(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['featureKey']);
      },
    }
  );

  const updateMutation = useMutation<
    FeatureData,
    Error,
    { id: string; data: UpdateFeatureRequest }
  >(
    ({ id, data }) => updateFeature(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['featureKey']);
      },
    }
  );

  const deleteMutation = useMutation<
    boolean,
    Error,
    string
  >(
    (id) => deleteFeature(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['featureKey']);
      },
    }
  );

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  };
}
```

### Composite Hooks (Combining Multiple Hooks)

```typescript
function useFeature(params?: FeatureParams) {
  // Use the more specific hooks
  const { 
    data: featureData,
    isLoading: isLoadingFeature,
    error: featureError,
    refetch: refetchFeature
  } = useFeatureData(params);
  
  const {
    data: relatedData,
    isLoading: isLoadingRelated,
    error: relatedError,
    refetch: refetchRelated
  } = useRelatedData(params?.relatedId);
  
  const {
    create,
    update,
    delete: deleteFeature, // Renamed to avoid JS keyword clash
  } = useFeatureMutations();
  
  // Compute the overall loading state
  const isLoading = isLoadingFeature || isLoadingRelated;
  
  // Compute the overall error state
  const error = featureError || relatedError;
  
  // Custom actions that combine multiple operations
  const refetchAll = useCallback(() => {
    refetchFeature();
    refetchRelated();
  }, [refetchFeature, refetchRelated]);
  
  return {
    // Data
    featureData,
    relatedData,
    
    // Loading states
    isLoading,
    isLoadingFeature,
    isLoadingRelated,
    
    // Error states
    error,
    featureError,
    relatedError,
    
    // Actions
    refetchAll,
    refetchFeature,
    refetchRelated,
    
    // Mutations
    create,
    update,
    delete: deleteFeature,
  };
}
```

## Forbidden Patterns

The following patterns should be avoided to ensure consistency:

❌ **Directly returning React Query hooks**
```typescript
// Do NOT do this
function useFeature() {
  return useQuery(['feature'], fetchFeature);
}
```

❌ **Inconsistent property naming**
```typescript
// Do NOT mix these patterns across features
function useFeatureA() {
  return {
    data: featureData,
    loading: isLoading, // Should be isLoading
    errorMessage: error, // Should be error
  };
}
```

❌ **Different return structures for similar operations**
```typescript
// Do NOT have different structures for similar hooks
function useFeatureA() {
  return { data, isLoading, error };
}

function useFeatureB() {
  return { featureData, isLoadingFeature, featureError };
}
```

## Migration Steps

To migrate an existing hook to the standardized pattern:

1. **Identify the hook type** (query, mutation, or composite)
2. **Adjust the return type** to match the standard pattern
3. **Add proper TypeScript typing** for all parameters and return values
4. **Update all consumers** of the hook to use the new property names
5. **Verify functionality** through tests and manual testing

## Examples from Existing Features

### Good Example: Tanks Feature

```typescript
function useTanks() {
  const query = useQuery<Tank[], Error>(
    ['tanks'],
    () => getTanks(),
    { staleTime: 5 * 60 * 1000 }
  );

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

### Needs Refactoring: Finance Feature

```typescript
// Current implementation
function useFinance() {
  const transactionsQuery = useQuery(['transactions'], getTransactions);
  const expensesQuery = useQuery(['expenses'], getExpenses);
  
  // ... more code ...
  
  return {
    transactionsQuery, // Should extract properties
    expensesQuery, // Should extract properties
    // ... more properties ...
  };
}

// Standardized implementation
function useFinance() {
  const transactionsQuery = useQuery(['transactions'], getTransactions);
  const expensesQuery = useQuery(['expenses'], getExpenses);
  
  // ... more code ...
  
  return {
    transactions: transactionsQuery.data || [],
    isLoadingTransactions: transactionsQuery.isLoading,
    transactionsError: transactionsQuery.error,
    
    expenses: expensesQuery.data || [],
    isLoadingExpenses: expensesQuery.isLoading,
    expensesError: expensesQuery.error,
    
    // ... more properties ...
  };
}
```

## Testing Standardized Hooks

Test files should also follow a consistent pattern:

```typescript
describe('useFeature', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should return feature data when fetch is successful', async () => {
    const mockData = [{ id: '1', name: 'Item 1' }];
    (fetchFeature as any).mockResolvedValue(mockData);
    
    const { result } = renderHook(() => useFeature());
    
    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });
  
  it('should return error when fetch fails', async () => {
    const mockError = new Error('Failed to fetch');
    (fetchFeature as any).mockRejectedValue(mockError);
    
    const { result } = renderHook(() => useFeature());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeUndefined();
  });
});
```

## Timeline for Hook Standardization

- Document official patterns (June 1, 2023)
- Update Finance hooks (June 2, 2023)
- Update Dashboard hooks (June 3, 2023)
- Verify tests are passing (June 4, 2023)
- Update any remaining hooks (June 5, 2023) 