/**
 * useApiQuery - Standardized hook for data fetching operations
 *
 * This hook wraps React Query's useQuery with standardized options and patterns
 * to ensure consistent data fetching across the application.
 */

import { useQuery } from '@tanstack/react-query';
import { UseApiQueryOptions, UseApiQueryResult } from "./types";

/**
 * Hook for making standardized API queries
 *
 * @example
 * ```tsx
 * const employees = useApiQuery({
 *   queryKey: ['employees', filters],
 *   queryFn: () => employeeService.getEmployees(filters),
 *   filters,
 *   staleTime: 5 * 60 * 1000 // 5 minutes
 * });
 *
 * // Use the standardized result
 * if (employees.isLoading) return <Loading />;
 * if (employees.isError) return <Error error={employees.error} />;
 * return <EmployeeList data={employees.data} />;
 * ```
 */
export function useApiQuery<TData, TError = Error, TFilters = unknown>({
  queryKey,
  queryFn,
  filters,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes default
  ...options
}: UseApiQueryOptions<TData, TError, TFilters>): UseApiQueryResult<TData> {
  // Use React Query's useQuery with our standardized options
  const queryResult = useQuery<TData, TError>({
    // If queryKey is already an array, use it directly; otherwise, wrap in array with filters
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey, filters],
    queryFn,
    enabled,
    staleTime,
    ...options,
  });

  // Return standardized result object
  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error as Error | null,
    refetch: queryResult.refetch,
    isFetching: queryResult.isFetching,
  };
}

/**
 * Hook for making standardized API queries with simpler return type
 * This version returns just the tuple of [data, loading, error] for simpler components
 */
export function useApiQuerySimple<TData, TError = Error, TFilters = unknown>(
  options: UseApiQueryOptions<TData, TError, TFilters>
): [TData | undefined, boolean, Error | null] {
  const result = useApiQuery<TData, TError, TFilters>(options);
  return [result.data, result.isLoading, result.error];
}

export default useApiQuery;
