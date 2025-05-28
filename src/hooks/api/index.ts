/**
 * API Hooks Index
 *
 * This file exports all API hooks and utilities for easy importing.
 *
 * @example
 * ```tsx
 * import { useApiQuery, useApiMutation, createResourceHooks } from '@/hooks/api';
 *
 * // Standard hook usage
 * const products = useApiQuery({
 *   queryKey: ['products'],
 *   queryFn: () => fetchProducts(),
 * });
 *
 * // Resource hooks factory usage
 * const { useList: useEmployees, useCreate: useCreateEmployee } = createResourceHooks({
 *   resourceName: 'employees',
 *   service: employeeService
 * });
 * ```
 */

// Core hooks
export { default as useApiQuery, useApiQuerySimple } from "./useApiQuery";
export {
  default as useApiMutation,
  useApiMutationSimple,
} from "./useApiMutation";
export { default as useApiInfiniteQuery } from "./useApiInfiniteQuery";

// Resource hooks factory
export { default as createResourceHooks } from "./createResourceHooks";

// Cache utilities
export {
  invalidateQueries,
  setQueryData,
  updateItemInList,
  addItemToList,
  removeItemFromList,
  createQueryKeys,
  createInvalidations,
} from "./cache-utils";

// Types
export type {
  BaseFilterParams,
  DateRangeFilter,
  UseApiQueryOptions,
  UseApiMutationOptions,
  UseApiInfiniteQueryOptions,
  UseApiQueryResult,
  UseApiMutationResult,
  ResourceService,
  ResourceHooksOptions,
  ResourceHooks,
  MutationSuccessCallback,
  QueryKey,
} from "./types";
