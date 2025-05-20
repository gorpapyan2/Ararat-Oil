import { 
  useQuery as useReactQuery, 
  useMutation as useReactMutation,
  UseQueryOptions, 
  UseQueryResult,
  UseMutationOptions,
  UseMutationResult
} from '@tanstack/react-query';
import { logger } from '@/utils/errorHandling';
import { useEffect } from 'react';

/**
 * Enhanced useQuery hook with better error handling and logging
 */
export function useQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends Array<unknown> = unknown[]
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  // Pass options directly to React Query
  const result = useReactQuery<TQueryFnData, TError, TData, TQueryKey>(options);
  
  // Handle error logging separately
  useEffect(() => {
    if (result.error) {
      logger.error(`Query error with key [${String(options.queryKey)}]`, result.error);
    }
  }, [result.error, options.queryKey]);

  return result;
}

/**
 * Enhanced useMutation hook with better error handling and logging
 */
export function useMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  // Pass options directly to React Query
  const result = useReactMutation<TData, TError, TVariables, TContext>(options);
  
  // Handle error logging separately
  useEffect(() => {
    if (result.error) {
      logger.error(
        `Mutation error${options.mutationKey ? ` with key [${String(options.mutationKey)}]` : ''}`, 
        result.error
      );
    }
  }, [result.error, options.mutationKey]);
  
  return result;
}

/**
 * Utility to add error handling to query results
 */
export function handleQueryError<T>(
  queryResult: { error: T | null | unknown },
  onError?: (error: T) => void
): void {
  useEffect(() => {
    if (queryResult.error) {
      // Log the error
      logger.error('Query/mutation error:', queryResult.error);
      
      // Call the error handler if provided
      if (onError && queryResult.error) {
        onError(queryResult.error as T);
      }
    }
  }, [queryResult.error, onError]);
} 