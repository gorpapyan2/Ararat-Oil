/**
 * Type definitions for API hooks
 * 
 * This file contains TypeScript interfaces and types used by the API hooks.
 */

import { 
  QueryKey as ReactQueryKey, 
  UseQueryOptions, 
  UseMutationOptions,
  UseInfiniteQueryOptions,
  QueryClient,
  InfiniteData
} from '@tanstack/react-query';

// Re-export QueryKey type
export type QueryKey = ReactQueryKey;

/**
 * Base filter parameters interface that can be extended by specific features
 */
export interface BaseFilterParams {
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

/**
 * Base date range filter that can be included in feature-specific filters
 */
export interface DateRangeFilter {
  dateFrom?: Date | string;
  dateTo?: Date | string;
}

/**
 * Options for useApiQuery hook
 */
export interface UseApiQueryOptions<TData, TError = Error, TFilters = unknown> 
  extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  
  /**
   * Query key for the request
   * Can be a string or an array
   */
  queryKey: QueryKey;
  
  /**
   * Function that fetches the data
   */
  queryFn: () => Promise<TData>;
  
  /**
   * Optional filters to apply to the query
   */
  filters?: TFilters;
  
  /**
   * Whether the query should execute
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Time in milliseconds before the query is considered stale
   * @default 300000 (5 minutes)
   */
  staleTime?: number;
}

/**
 * Success callback for mutations with access to queryClient
 */
export type MutationSuccessCallback<TData, TVariables, TContext> = 
  (data: TData, variables: TVariables, context: TContext | undefined, queryClient: QueryClient) => void;

/**
 * Options for useApiMutation hook
 */
export interface UseApiMutationOptions<TData, TVariables, TError = Error>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn' | 'onSuccess'> {
  
  /**
   * Function that performs the mutation
   */
  mutationFn: (variables: TVariables) => Promise<TData>;
  
  /**
   * Query keys to invalidate on success
   */
  invalidateQueries?: QueryKey[];
  
  /**
   * Custom success callback
   */
  onSuccessCallback?: MutationSuccessCallback<TData, TVariables, unknown>;
}

/**
 * Options for useApiInfiniteQuery hook
 */
export interface UseApiInfiniteQueryOptions<TData, TError = Error, TFilters = unknown>
  extends Omit<UseInfiniteQueryOptions<TData, TError, number>, 'queryKey' | 'queryFn' | 'getNextPageParam'> {
  
  /**
   * Query key for the request
   */
  queryKey: QueryKey;
  
  /**
   * Function that fetches the data for a page
   */
  queryFn: (pageParam: number) => Promise<TData>;
  
  /**
   * Optional filters to apply to the query
   */
  filters?: TFilters;
  
  /**
   * Function to get the next page parameter
   * Default implementation expects a pages property in the response
   */
  getNextPageParam?: (lastPage: TData, allPages: TData[]) => number | undefined;
}

/**
 * Base resource service interface
 */
export interface ResourceService<TData, TFilters, TCreateData, TUpdateData> {
  getList: (filters?: TFilters) => Promise<TData[]>;
  getById: (id: string) => Promise<TData>;
  create: (data: TCreateData) => Promise<TData>;
  update: (id: string, data: TUpdateData) => Promise<TData>;
  delete: (id: string) => Promise<void | boolean>;
  getSummary?: () => Promise<any>;
}

/**
 * Resource hooks factory options
 */
export interface ResourceHooksOptions<TData, TFilters, TCreateData, TUpdateData> {
  resourceName: string;
  service: ResourceService<TData, TFilters, TCreateData, TUpdateData>;
  options?: {
    staleTime?: number;
    cacheTime?: number;
  };
}

/**
 * Resource hooks factory return type
 */
export interface ResourceHooks<TData, TFilters, TCreateData, TUpdateData> {
  useList: (filters?: TFilters) => UseApiQueryResult<TData[]>;
  useById: (id: string) => UseApiQueryResult<TData>;
  useCreate: () => UseApiMutationResult<TData, TCreateData>;
  useUpdate: () => UseApiMutationResult<TData, { id: string; data: TUpdateData }>;
  useDelete: () => UseApiMutationResult<void, string>;
  useSummary?: () => UseApiQueryResult<any>;
}

/**
 * Result type for useApiQuery
 */
export type UseApiQueryResult<TData> = {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
  isFetching: boolean;
};

/**
 * Result type for useApiMutation
 */
export type UseApiMutationResult<TData, TVariables> = {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  data: TData | undefined;
  reset: () => void;
}; 