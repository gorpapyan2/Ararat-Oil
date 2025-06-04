/**
 * Centralized Entity Hook
 * 
 * This hook eliminates the duplicated patterns in useSupabase.ts by providing
 * a generic, reusable hook for all entity CRUD operations.
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  EntityService, 
  type BaseEntity, 
  type PaginationParams, 
  type SearchParams, 
  type EntityStats 
} from '@/services/centralized-api';

// Hook state interface
export interface EntityHookState<T extends BaseEntity> {
  data: T[];
  loading: boolean;
  error: string | null;
  stats?: EntityStats;
}

// Hook operations interface
export interface EntityHookOperations<T extends BaseEntity> {
  refetch: () => Promise<void>;
  create: (item: Partial<T>) => Promise<T>;
  update: (id: string, updates: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
  softDelete: (id: string) => Promise<T>;
  bulkCreate: (items: Partial<T>[]) => Promise<T[]>;
  search: (params: SearchParams) => Promise<T[]>;
  getStats: () => Promise<void>;
}

// Complete hook return type
export interface EntityHookReturn<T extends BaseEntity> 
  extends EntityHookState<T>, EntityHookOperations<T> {}

/**
 * Centralized entity hook that handles all CRUD operations
 */
export function useCentralizedEntity<T extends BaseEntity>(
  entityType: string,
  options: {
    autoFetch?: boolean;
    filters?: Record<string, string | number | boolean>;
    pagination?: PaginationParams;
    activeOnly?: boolean;
  } = {}
): EntityHookReturn<T> {
  const {
    autoFetch = true,
    filters,
    pagination,
    activeOnly = false
  } = options;

  // State
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<EntityStats | undefined>(undefined);

  // Service instance
  const [service] = useState(() => new EntityService<T>(entityType));

  /**
   * Centralized error handler
   */
  const handleError = useCallback((err: unknown, operation: string) => {
    const errorMessage = err instanceof Error ? err.message : `${operation} failed`;
    console.error(`${operation} error:`, err);
    setError(errorMessage);
  }, []);

  /**
   * Safe operation wrapper
   */
  const safeOperation = useCallback(async <R>(
    operation: string,
    fn: () => Promise<R>,
    updateState = true
  ): Promise<R> => {
    try {
      if (updateState) {
        setError(null);
      }
      return await fn();
    } catch (err) {
      handleError(err, operation);
      throw err;
    }
  }, [handleError]);

  /**
   * Fetch data based on current options
   */
  const fetchData = useCallback(async () => {
    return safeOperation('Fetch data', async () => {
      setLoading(true);
      
      let result: T[];
      if (activeOnly) {
        result = await service.fetchActive(pagination);
      } else {
        result = await service.fetchAll(filters, pagination);
      }
      
      setData(result);
      setLoading(false);
      return result;
    });
  }, [service, activeOnly, filters, pagination, safeOperation]);

  /**
   * Create new entity
   */
  const create = useCallback(async (item: Partial<T>): Promise<T> => {
    return safeOperation('Create entity', async () => {
      const created = await service.create(item);
      setData(prev => [created, ...prev]);
      return created;
    });
  }, [service, safeOperation]);

  /**
   * Update existing entity
   */
  const update = useCallback(async (id: string, updates: Partial<T>): Promise<T> => {
    return safeOperation('Update entity', async () => {
      const updated = await service.update(id, updates);
      setData(prev => prev.map(item => item.id === id ? updated : item));
      return updated;
    });
  }, [service, safeOperation]);

  /**
   * Delete entity (hard delete)
   */
  const deleteEntity = useCallback(async (id: string): Promise<void> => {
    return safeOperation('Delete entity', async () => {
      await service.delete(id);
      setData(prev => prev.filter(item => item.id !== id));
    });
  }, [service, safeOperation]);

  /**
   * Soft delete entity
   */
  const softDelete = useCallback(async (id: string): Promise<T> => {
    return safeOperation('Soft delete entity', async () => {
      const updated = await service.softDelete(id);
      setData(prev => prev.map(item => item.id === id ? updated : item));
      return updated;
    });
  }, [service, safeOperation]);

  /**
   * Bulk create entities
   */
  const bulkCreate = useCallback(async (items: Partial<T>[]): Promise<T[]> => {
    return safeOperation('Bulk create entities', async () => {
      const created = await service.bulkCreate(items);
      setData(prev => [...created, ...prev]);
      return created;
    });
  }, [service, safeOperation]);

  /**
   * Search entities
   */
  const search = useCallback(async (params: SearchParams): Promise<T[]> => {
    return safeOperation('Search entities', async () => {
      setLoading(true);
      const results = await service.search(params);
      setData(results);
      setLoading(false);
      return results;
    });
  }, [service, safeOperation]);

  /**
   * Get entity statistics
   */
  const getStats = useCallback(async (): Promise<void> => {
    return safeOperation('Get entity statistics', async () => {
      const entityStats = await service.getStats();
      setStats(entityStats);
    }, false);
  }, [service, safeOperation]);

  /**
   * Refetch data (useful for manual refresh)
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchData();
  }, [fetchData]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData().catch(() => {
        // Error is already handled in fetchData
      });
    }
  }, [autoFetch, fetchData]);

  return {
    // State
    data,
    loading,
    error,
    stats,
    // Operations
    refetch,
    create,
    update,
    delete: deleteEntity,
    softDelete,
    bulkCreate,
    search,
    getStats,
  };
}

/**
 * Pre-configured hooks for common entities
 */

export function useEmployees(options?: Parameters<typeof useCentralizedEntity>[1]) {
  return useCentralizedEntity('employees', options);
}

export function useFuelTypes(options?: Parameters<typeof useCentralizedEntity>[1]) {
  return useCentralizedEntity('fuel_types', options);
}

export function useTanks(options?: Parameters<typeof useCentralizedEntity>[1]) {
  return useCentralizedEntity('tanks', options);
}

export function usePetrolProviders(options?: Parameters<typeof useCentralizedEntity>[1]) {
  return useCentralizedEntity('petrol_providers', options);
}

export function useFillingSystems(options?: Parameters<typeof useCentralizedEntity>[1]) {
  return useCentralizedEntity('filling_systems', options);
}

/**
 * Hook for active entities only (common pattern)
 */
export function useActiveEntities<T extends BaseEntity>(
  entityType: string,
  pagination?: PaginationParams
) {
  return useCentralizedEntity<T>(entityType, {
    activeOnly: true,
    pagination,
  });
}

/**
 * Hook with search functionality
 */
export function useEntitySearch<T extends BaseEntity>(
  entityType: string,
  initialSearchParams?: SearchParams
) {
  const hook = useCentralizedEntity<T>(entityType, { autoFetch: false });
  
  const performSearch = useCallback(async (params: SearchParams) => {
    return hook.search(params);
  }, [hook]);

  // Perform initial search if params provided
  useEffect(() => {
    if (initialSearchParams) {
      performSearch(initialSearchParams);
    }
  }, [performSearch, initialSearchParams]);

  return {
    ...hook,
    performSearch,
  };
}

/**
 * Hook with statistics
 */
export function useEntityWithStats<T extends BaseEntity>(
  entityType: string,
  options?: Parameters<typeof useCentralizedEntity>[1]
) {
  const hook = useCentralizedEntity<T>(entityType, options);
  
  // Auto-fetch stats on mount
  useEffect(() => {
    hook.getStats();
  }, [hook]);

  return hook;
}

/**
 * Migration helpers for existing code
 * These provide backward compatibility while transitioning to centralized hooks
 */

export function useEmployeesLegacy() {
  const hook = useEmployees();
  
  return {
    employees: hook.data,
    loading: hook.loading,
    error: hook.error,
    refetch: hook.refetch,
    createEmployee: hook.create,
    updateEmployee: hook.update,
    deleteEmployee: hook.delete,
  };
}

export function useFuelTypesLegacy() {
  const hook = useFuelTypes();
  
  return {
    fuelTypes: hook.data,
    loading: hook.loading,
    error: hook.error,
    refetch: hook.refetch,
    createFuelType: hook.create,
    updateFuelType: hook.update,
    deleteFuelType: hook.delete,
  };
}

export function useFillingSystemsLegacy() {
  const hook = useFillingSystems();
  
  return {
    systems: hook.data,
    loading: hook.loading,
    error: hook.error,
    refetch: hook.refetch,
    createSystem: hook.create,
    updateSystem: hook.update,
    deleteSystem: hook.delete,
  };
} 