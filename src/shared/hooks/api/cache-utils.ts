/**
 * Cache utilities for API hooks
 *
 * This file contains helper functions for managing the React Query cache
 * in a consistent way across the application.
 */

import { QueryClient, QueryKey } from "@tanstack/react-query";

/**
 * Invalidates all queries with the given keys
 */
export function invalidateQueries(
  queryClient: QueryClient,
  queryKeys: QueryKey[]
): void {
  queryKeys.forEach((key) => {
    queryClient.invalidateQueries({
      queryKey: Array.isArray(key) ? key : [key],
    });
  });
}

/**
 * Sets data in the cache for a specific query key
 */
export function setQueryData<T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  data: T
): void {
  queryClient.setQueryData(queryKey, data);
}

/**
 * Updates an item in a list query
 *
 * @param queryClient - The query client instance
 * @param listQueryKey - The query key for the list
 * @param itemId - The ID of the item to update
 * @param updateFn - Function that receives the old item and returns the updated item
 * @param idField - The field name used as ID (default: 'id')
 */
export function updateItemInList<T extends Record<string, unknown>>(
  queryClient: QueryClient,
  listQueryKey: QueryKey,
  itemId: string,
  updateFn: (oldItem: T) => T,
  idField: string = "id"
): void {
  // Get the current data
  const currentData = queryClient.getQueryData<T[]>(listQueryKey);

  if (!currentData) return;

  // Update the item in the array
  const newData = currentData.map((item) =>
    item[idField] === itemId ? updateFn(item) : item
  );

  // Update the cache
  queryClient.setQueryData(listQueryKey, newData);
}

/**
 * Adds a new item to a list query
 */
export function addItemToList<T>(
  queryClient: QueryClient,
  listQueryKey: QueryKey,
  newItem: T
): void {
  // Get the current data
  const currentData = queryClient.getQueryData<T[]>(listQueryKey);

  if (!currentData) {
    // If no data exists yet, create a new array with the item
    queryClient.setQueryData(listQueryKey, [newItem]);
  } else {
    // Add the item to the existing array
    queryClient.setQueryData(listQueryKey, [...currentData, newItem]);
  }
}

/**
 * Removes an item from a list query
 */
export function removeItemFromList<T extends Record<string, unknown>>(
  queryClient: QueryClient,
  listQueryKey: QueryKey,
  itemId: string,
  idField: string = "id"
): void {
  // Get the current data
  const currentData = queryClient.getQueryData<T[]>(listQueryKey);

  if (!currentData) return;

  // Remove the item from the array
  const newData = currentData.filter((item) => item[idField] !== itemId);

  // Update the cache
  queryClient.setQueryData(listQueryKey, newData);
}

/**
 * Generates a standard set of query keys for a resource
 */
export function createQueryKeys(resourceName: string) {
  return {
    all: [resourceName] as const,
    lists: () => [...createQueryKeys(resourceName).all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...createQueryKeys(resourceName).lists(), filters] as const,
    details: () => [...createQueryKeys(resourceName).all, "detail"] as const,
    detail: (id: string) =>
      [...createQueryKeys(resourceName).details(), id] as const,
    summary: () => [...createQueryKeys(resourceName).all, "summary"] as const,
  };
}

/**
 * Creates a standard set of invalidation functions for a resource
 */
export function createInvalidations(
  queryClient: QueryClient,
  resourceName: string
) {
  const keys = createQueryKeys(resourceName);

  return {
    /**
     * Invalidates all queries for this resource
     */
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: keys.all });
    },

    /**
     * Invalidates only list queries
     */
    invalidateLists: () => {
      queryClient.invalidateQueries({ queryKey: keys.lists() });
    },

    /**
     * Invalidates a specific detail query
     */
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({ queryKey: keys.detail(id) });
    },

    /**
     * Invalidates the summary query
     */
    invalidateSummary: () => {
      queryClient.invalidateQueries({ queryKey: keys.summary() });
    },
  };
}
