# API Hooks Cheat Sheet

## Quick Reference

### Creating Resource Hooks

```tsx
import { createResourceHooks } from '@/hooks/api';
import { yourService } from './services';

// Define the resource service adapter
const resourceService = {
  getList: (filters) => yourService.getItems(filters),
  getById: (id) => yourService.getItemById(id),
  create: (data) => yourService.createItem(data),
  update: (id, data) => yourService.updateItem(id, data),
  delete: (id) => yourService.deleteItem(id),
};

// Create the hooks
const {
  useList,
  useById,
  useCreate,
  useUpdate,
  useDelete
} = createResourceHooks({
  service: resourceService,
  resourceName: 'item',  // Used in query keys
  resourcePath: 'items', // Used in API paths
  staleTime: 300000,     // 5 minutes (optional)
});

// Export individually for granular usage
export {
  useList as useItemsList,
  useById as useItemById,
  useCreate as useCreateItem,
  useUpdate as useUpdateItem,
  useDelete as useDeleteItem,
};
```

### Using Hooks

```tsx
// List hook
const { data, isLoading, error } = useItemsList({
  filters: { status: 'active' },
  enabled: true,
});

// Get by ID hook
const { data, isLoading } = useItemById(id);

// Create hook
const { mutate, isLoading } = useCreateItem();
mutate(newItemData, {
  onSuccess: (data) => console.log('Created:', data),
});

// Update hook
const { mutate, isLoading } = useUpdateItem();
mutate({ 
  id: '123', 
  data: { name: 'Updated Name' } 
});

// Delete hook
const { mutate, isLoading } = useDeleteItem();
mutate('123');
```

## Type Definitions

### Resource Types

```tsx
// Define your resource type
interface YourResource {
  id: string;
  name: string;
  // ... other properties
}

// Define filter type
interface YourFilters {
  status?: string;
  category?: string;
  // ... other filter properties
}

// Create hooks with proper typing
const hooks = createResourceHooks<YourResource, YourFilters>({
  // ... configuration
});
```

### Service Interface

```tsx
// Required service interface
interface ResourceService<TData, TFilters> {
  getList: (filters?: TFilters) => Promise<TData[]>;
  getById: (id: string) => Promise<TData>;
  create: (data: Omit<TData, 'id'>) => Promise<TData>;
  update: (id: string, data: Partial<TData>) => Promise<TData>;
  delete: (id: string) => Promise<void | boolean>;
}
```

## Common Patterns

### Backwards Compatibility

```tsx
// Create a compatibility hook that matches old API
export function useYourFeature() {
  const list = useYourList();
  const create = useCreateItem();
  const update = useUpdateItem();
  const delete = useDeleteItem();

  return {
    items: list.data || [],
    isLoading: list.isLoading,
    error: list.error,
    createItem: create.mutate,
    updateItem: update.mutate,
    deleteItem: delete.mutate,
    refetch: list.refetch,
  };
}
```

### Custom Query Functions

```tsx
const { data } = useApiQuery({
  queryKey: 'custom-query',
  queryFn: async () => {
    const response = await fetch('/api/custom-endpoint');
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },
});
```

### Dependent Queries

```tsx
const { data: user } = useApiQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

const { data: userPosts } = useApiQuery({
  queryKey: ['posts', userId],
  queryFn: () => fetchUserPosts(userId),
  enabled: !!user, // Only runs when user data exists
});
```

### Optimistic Updates

```tsx
const { mutate } = useUpdateItem({
  onMutate: async (variables) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['items', variables.id]);
    
    // Snapshot previous value
    const previousItem = queryClient.getQueryData(['items', variables.id]);
    
    // Optimistically update the cache
    queryClient.setQueryData(['items', variables.id], old => ({
      ...old,
      ...variables.data
    }));
    
    return { previousItem };
  },
  onError: (err, variables, context) => {
    // Restore previous value on error
    queryClient.setQueryData(
      ['items', variables.id], 
      context.previousItem
    );
  }
});
```

### Infinite Queries

```tsx
const {
  data,
  fetchNextPage,
  hasNextPage
} = useApiInfiniteQuery({
  queryKey: 'paginated-items',
  queryFn: (pageParam = 1) => fetchPage(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
});
```

## Debugging

### Query Keys

```tsx
// Common query key patterns:
['items']                    // List all items
['items', { filters }]       // Filtered list
['item', id]                 // Single item
['items', 'summary']         // Summary data
```

### Cache Inspection

```tsx
// Get data from cache
const data = queryClient.getQueryData(['items']);

// Manually set cache data
queryClient.setQueryData(['items'], newData);

// Invalidate queries to refetch
queryClient.invalidateQueries({
  queryKey: ['items'],
  exact: false, // Invalidates all queries that start with 'items'
});

// Remove queries
queryClient.removeQueries({
  queryKey: ['items', id],
  exact: true,
});
```

### Common Issues

1. **Missing Query Keys**: Always include a unique, stable query key.
2. **Unnecessary Refetches**: Check your `staleTime` configuration.
3. **Type Errors**: Ensure your service interface matches the required `ResourceService` interface.
4. **Invalid Cache Updates**: Review how mutation callbacks update the cache.
5. **Parallel Queries**: Use `Promise.all()` with multiple queries or the `useQueries` hook.

## Performance Tips

1. Use `select` to transform data without triggering rerenders
2. Set appropriate `staleTime` based on data volatility
3. Disable queries when not needed with `enabled: false`
4. Use `keepPreviousData: true` for smoother UX during refetches
5. Consider using `placeholderData` for immediate UI feedback 