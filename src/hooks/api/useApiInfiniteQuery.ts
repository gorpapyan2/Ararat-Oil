/**
 * useApiInfiniteQuery - Standardized hook for paginated data fetching
 *
 * This hook wraps React Query's useInfiniteQuery with standardized options and patterns
 * to ensure consistent paginated data fetching across the application.
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { UseApiInfiniteQueryOptions } from "./types";

/**
 * Hook for making standardized API infinite/paginated queries
 *
 * @example
 * ```tsx
 * const productsQuery = useApiInfiniteQuery({
 *   queryKey: ['products', filters],
 *   queryFn: (pageParam) => productService.getProducts({ ...filters, page: pageParam }),
 *   filters,
 *   getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
 * });
 *
 * // Use the standardized result
 * if (productsQuery.isLoading) return <Loading />;
 * if (productsQuery.isError) return <Error error={productsQuery.error} />;
 * return (
 *   <ProductList
 *     data={productsQuery.data.pages.flatMap(page => page.items)}
 *     hasMore={productsQuery.hasNextPage}
 *     loadMore={productsQuery.fetchNextPage}
 *     isLoadingMore={productsQuery.isFetchingNextPage}
 *   />
 * );
 * ```
 */
export function useApiInfiniteQuery<TData, TError = Error, TFilters = unknown>({
  queryKey,
  queryFn,
  filters,
  getNextPageParam,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes default
  ...options
}: UseApiInfiniteQueryOptions<TData, TError, TFilters>) {
  // Use React Query's useInfiniteQuery with our standardized options
  const infiniteQueryResult = useInfiniteQuery<TData, TError>({
    // If queryKey is already an array, use it directly; otherwise, wrap in array with filters
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey, filters],
    queryFn: ({ pageParam = 1 }) => queryFn(pageParam),

    // Default getNextPageParam implementation if not provided
    getNextPageParam:
      getNextPageParam ||
      ((lastPage: unknown) => {
        // Default implementation expects a standard pagination structure
        // Override this by providing your own getNextPageParam function
        if (!lastPage) return undefined;

        // Try common pagination patterns
        const page = lastPage as Record<string, unknown>;
        if (page.nextPage) return page.nextPage;
        if (
          page.page &&
          page.totalPages &&
          typeof page.page === 'number' &&
          typeof page.totalPages === 'number' &&
          page.page < page.totalPages
        ) {
          return page.page + 1;
        }
        if (page.hasMore) return ((page.page as number) || 1) + 1;

        return undefined;
      }),

    enabled,
    staleTime,
    ...options,
  });

  // Return standardized result object with commonly used properties
  return {
    // Original result
    ...infiniteQueryResult,

    // Convenience properties for common use cases
    data: infiniteQueryResult.data,
    isLoading: infiniteQueryResult.isLoading,
    isError: infiniteQueryResult.isError,
    error: infiniteQueryResult.error as Error | null,
    hasNextPage: infiniteQueryResult.hasNextPage,
    isFetchingNextPage: infiniteQueryResult.isFetchingNextPage,

    // Helper methods
    loadMore: infiniteQueryResult.fetchNextPage,
    refresh: infiniteQueryResult.refetch,

    // Helper computed property that flattens all pages (common use case)
    flatData:
      infiniteQueryResult.data?.pages.flatMap((page: unknown) => {
        // Try to get items from common response structures
        if (Array.isArray(page)) return page;
        const pageObj = page as Record<string, unknown>;
        if (pageObj.items && Array.isArray(pageObj.items)) return pageObj.items;
        if (pageObj.data && Array.isArray(pageObj.data)) return pageObj.data;
        if (pageObj.results && Array.isArray(pageObj.results)) return pageObj.results;
        return [];
      }) || [],
  };
}

export default useApiInfiniteQuery;
