/**
 * useApiMutation - Standardized hook for data mutation operations
 * 
 * This hook wraps React Query's useMutation with standardized options and patterns
 * to ensure consistent data mutation and cache invalidation across the application.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UseApiMutationOptions, 
  UseApiMutationResult 
} from './types';

/**
 * Hook for making standardized API mutations with built-in cache invalidation
 * 
 * @example
 * ```tsx
 * const createEmployee = useApiMutation({
 *   mutationFn: (data) => employeeService.createEmployee(data),
 *   invalidateQueries: ['employees'],
 *   onSuccessCallback: (data, variables, context, queryClient) => {
 *     // Additional success handling
 *     toast.success('Employee created successfully');
 *   }
 * });
 * 
 * // Usage in component
 * const handleSubmit = (data) => {
 *   createEmployee.mutate(data);
 * };
 * ```
 */
export function useApiMutation<TData, TVariables, TError = Error>({
  mutationFn,
  invalidateQueries = [],
  onSuccessCallback,
  ...options
}: UseApiMutationOptions<TData, TVariables, TError>): UseApiMutationResult<TData, TVariables> {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<TData, TError, TVariables>({
    mutationFn,
    
    // Standard success handler with cache invalidation
    onSuccess: (data, variables, context) => {
      // Invalidate specified queries
      invalidateQueries.forEach(queryKey => {
        // Normalize the query key to ensure it's always an array
        const normalizedKey = Array.isArray(queryKey) ? queryKey : [queryKey];
        queryClient.invalidateQueries({ queryKey: normalizedKey });
      });
      
      // Call custom success handler if provided
      if (onSuccessCallback) {
        onSuccessCallback(data, variables, context, queryClient);
      }
    },
    
    ...options,
  });

  // Return standardized result
  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook for making standardized API mutations with a simpler return type
 * This version focuses on just the essential properties for common use cases
 */
export function useApiMutationSimple<TData, TVariables, TError = Error>(
  options: UseApiMutationOptions<TData, TVariables, TError>
): [
  (variables: TVariables) => void,
  boolean,
  Error | null
] {
  const result = useApiMutation<TData, TVariables, TError>(options);
  return [result.mutate, result.isLoading, result.error];
}

export default useApiMutation; 