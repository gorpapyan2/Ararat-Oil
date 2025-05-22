import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { act } from 'react-dom/test-utils';
import { useApiMutation } from '../useApiMutation';

// Create test data
const mockItem = { id: '1', name: 'Test Item' };
const mockCreateFn = jest.fn().mockResolvedValue(mockItem);
const mockUpdateFn = jest.fn().mockImplementation((data) => Promise.resolve({ ...mockItem, ...data }));
const mockErrorFn = jest.fn().mockRejectedValue(new Error('Mutation failed'));

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useApiMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should perform a successful mutation', async () => {
    const { result } = renderHook(
      () => useApiMutation({
        mutationFn: mockCreateFn,
      }),
      {
        wrapper: createWrapper(),
      }
    );

    // Initially not loading
    expect(result.current.isLoading).toBe(false);
    
    // Trigger mutation
    act(() => {
      result.current.mutate({ name: 'New Item' });
    });
    
    // Should be loading now
    expect(result.current.isLoading).toBe(true);
    
    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Check mutation was called with correct data
    expect(mockCreateFn).toHaveBeenCalledWith({ name: 'New Item' });
    
    // Should have data and success state
    expect(result.current.data).toEqual(mockItem);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle mutation errors', async () => {
    const { result } = renderHook(
      () => useApiMutation({
        mutationFn: mockErrorFn,
      }),
      {
        wrapper: createWrapper(),
      }
    );
    
    // Trigger mutation
    act(() => {
      result.current.mutate({ name: 'Error Item' });
    });
    
    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    // Check error state
    expect(mockErrorFn).toHaveBeenCalledWith({ name: 'Error Item' });
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(new Error('Mutation failed'));
    expect(result.current.data).toBeUndefined();
  });

  it('should execute callback functions', async () => {
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();
    const onSettledMock = jest.fn();

    const { result } = renderHook(
      () => useApiMutation({
        mutationFn: mockUpdateFn,
      }),
      {
        wrapper: createWrapper(),
      }
    );
    
    // Trigger mutation with callbacks
    act(() => {
      result.current.mutate(
        { name: 'Updated Item' },
        {
          onSuccess: onSuccessMock,
          onError: onErrorMock,
          onSettled: onSettledMock,
        }
      );
    });
    
    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    // Check callbacks
    expect(onSuccessMock).toHaveBeenCalledWith(
      { id: '1', name: 'Updated Item' },
      { name: 'Updated Item' },
      expect.anything()
    );
    expect(onErrorMock).not.toHaveBeenCalled();
    expect(onSettledMock).toHaveBeenCalled();
  });

  it('should support invalidation of queries', async () => {
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(
      () => useApiMutation({
        mutationFn: mockCreateFn,
        invalidateQueries: ['items'],
      }),
      {
        wrapper,
      }
    );
    
    // Trigger mutation
    act(() => {
      result.current.mutate({ name: 'New Item' });
    });
    
    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    // Check invalidation
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(['items']);
  });

  it('should support optimistic updates with rollback on error', async () => {
    const queryClient = new QueryClient();
    const queryKey = ['item', '1'];
    
    // Setup initial data
    queryClient.setQueryData(queryKey, { id: '1', name: 'Original' });
    
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(
      () => useApiMutation({
        mutationFn: mockErrorFn, // This will fail
        onMutate: async (variables) => {
          // Cancel outgoing refetches
          await queryClient.cancelQueries(queryKey);
          
          // Snapshot the previous value
          const previousValue = queryClient.getQueryData(queryKey);
          
          // Optimistically update
          queryClient.setQueryData(queryKey, (old: any) => ({ 
            ...old, 
            name: variables.name 
          }));
          
          return { previousValue };
        },
        onError: (error, variables, context) => {
          // Rollback to previous value on error
          if (context?.previousValue) {
            queryClient.setQueryData(queryKey, context.previousValue);
          }
        },
      }),
      {
        wrapper,
      }
    );

    // Check initial state
    expect(queryClient.getQueryData(queryKey)).toEqual({ id: '1', name: 'Original' });
    
    // Trigger mutation
    act(() => {
      result.current.mutate({ name: 'Optimistic Update' });
    });
    
    // Immediately after mutation starts, optimistic update should be applied
    expect(queryClient.getQueryData(queryKey)).toEqual({ id: '1', name: 'Optimistic Update' });
    
    // Wait for mutation to fail
    await waitFor(() => expect(result.current.isError).toBe(true));
    
    // After error, value should be rolled back
    expect(queryClient.getQueryData(queryKey)).toEqual({ id: '1', name: 'Original' });
  });
}); 