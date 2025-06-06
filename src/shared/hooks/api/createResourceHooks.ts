/**
 * Resource Hooks Factory
 *
 * This factory function creates a set of standardized hooks for a resource,
 * reducing duplication across features and ensuring consistent patterns.
 */

import useApiQuery from "./useApiQuery";
import useApiMutation from "./useApiMutation";
import { createQueryKeys } from './cache-utils';
import type {
  ResourceService,
  ResourceHooksOptions,
  ResourceHooks,
  UseApiQueryResult,
  UseApiMutationResult,
} from "./types";

/**
 * Creates a set of standardized hooks for a resource
 *
 * @example
 * ```tsx
 * // Define your service implementation
 * const employeeService = {
 *   getList: (filters) => api.get('/employees', { params: filters }),
 *   getById: (id) => api.get(`/employees/${id}`),
 *   create: (data) => api.post('/employees', data),
 *   update: (id, data) => api.put(`/employees/${id}`, data),
 *   delete: (id) => api.delete(`/employees/${id}`),
 *   getSummary: () => api.get('/employees/summary')
 * };
 *
 * // Create the hooks
 * const {
 *   useList: useEmployees,
 *   useById: useEmployeeById,
 *   useCreate: useCreateEmployee,
 *   useUpdate: useUpdateEmployee,
 *   useDelete: useDeleteEmployee,
 *   useSummary: useEmployeeSummary
 * } = createResourceHooks({
 *   resourceName: 'employees',
 *   service: employeeService
 * });
 *
 * // Use in components
 * function EmployeesList() {
 *   const { data, isLoading } = useEmployees({ status: 'active' });
 *
 *   if (isLoading) return <Loading />;
 *   return <Table data={data} />;
 * }
 * ```
 */
export function createResourceHooks<
  TData extends Record<string, unknown>,
  TFilters extends Record<string, unknown>,
  TCreateData,
  TUpdateData,
>({
  resourceName,
  service,
  options = {},
}: ResourceHooksOptions<
  TData,
  TFilters,
  TCreateData,
  TUpdateData
>): ResourceHooks<TData, TFilters, TCreateData, TUpdateData> {
  // Default options
  const defaultOptions = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  };

  // Create standard query keys for this resource
  const queryKeys = createQueryKeys(resourceName);

  // Hook for fetching a list of resources with optional filters
  const useList = (filters?: TFilters): UseApiQueryResult<TData[]> => {
    return useApiQuery({
      queryKey: queryKeys.list(filters || ({} as Record<string, unknown>)),
      queryFn: () => service.getList(filters),
      filters,
      staleTime: defaultOptions.staleTime,
    });
  };

  // Hook for fetching a single resource by ID
  const useById = (id: string): UseApiQueryResult<TData> => {
    return useApiQuery({
      queryKey: queryKeys.detail(id),
      queryFn: () => service.getById(id),
      enabled: !!id,
      staleTime: defaultOptions.staleTime,
    });
  };

  // Hook for creating a new resource
  const useCreate = (): UseApiMutationResult<TData, TCreateData> => {
    return useApiMutation({
      mutationFn: (data: TCreateData) => service.create(data),
      invalidateQueries: [
        queryKeys.lists(), // Invalidate all list queries
        queryKeys.summary(), // Invalidate summary if it exists
      ],
    });
  };

  // Hook for updating an existing resource
  const useUpdate = (): UseApiMutationResult<
    TData,
    { id: string; data: TUpdateData }
  > => {
    return useApiMutation({
      mutationFn: ({ id, data }: { id: string; data: TUpdateData }) =>
        service.update(id, data),
      onSuccessCallback: (updatedResource, { id }, _, queryClient) => {
        // Update the item in cache directly when possible
        try {
          queryClient.setQueryData(queryKeys.detail(id), updatedResource);
        } catch (e) {
          // If direct update fails, invalidate instead
          queryClient.invalidateQueries({ queryKey: queryKeys.detail(id) });
        }
      },
      invalidateQueries: [
        queryKeys.lists(), // Invalidate all list queries
        queryKeys.summary(), // Invalidate summary if it exists
      ],
    });
  };

  // Hook for deleting a resource
  const useDelete = (): UseApiMutationResult<void, string> => {
    return useApiMutation({
      mutationFn: async (id: string) => {
        await service.delete(id);
        return;
      },
      onSuccessCallback: (_, id, __, queryClient) => {
        // Remove the item from cache
        queryClient.removeQueries({ queryKey: queryKeys.detail(id) });
      },
      invalidateQueries: [
        queryKeys.lists(), // Invalidate all list queries
        queryKeys.summary(), // Invalidate summary if it exists
      ],
    });
  };

  // Create the summary hook if the service provides getSummary
  const useSummary = service.getSummary
    ? (): UseApiQueryResult<Record<string, unknown>> => {
        return useApiQuery({
          queryKey: queryKeys.summary(),
          queryFn: () => service.getSummary!(),
          staleTime: defaultOptions.staleTime,
        });
      }
    : undefined;

  // Return all the hooks
  return {
    useList,
    useById,
    useCreate,
    useUpdate,
    useDelete,
    useSummary,
  };
}

export default createResourceHooks;
