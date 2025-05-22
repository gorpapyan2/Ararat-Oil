/**
 * Tanks Hooks - Refactored Version
 * 
 * This file demonstrates the migration from the old implementation to
 * the new standardized API hooks system.
 */

import { createResourceHooks, useApiQuery, useApiMutation, QueryKey } from '@/hooks/api';
import {
  getTanks,
  getTankById,
  getTankLevelChanges,
  createTank,
  updateTank,
  deleteTank,
  getFuelTypes,
  adjustTankLevel,
  tanksService
} from '../services';
import type { 
  FuelTank, 
  TankLevelChange, 
  CreateTankRequest, 
  UpdateTankRequest, 
  FuelType 
} from '../types/tanks.types';

// Define an empty filters type that extends Record<string, any>
interface TankFilters extends Record<string, any> {
  // Optional filter properties can be added here
  status?: 'active' | 'inactive';
  fuelTypeId?: string;
  searchQuery?: string;
}

// Adapt the service to match ResourceService interface
const tanksResourceService = {
  getList: getTanks,
  getById: getTankById,
  create: createTank,
  update: updateTank,
  delete: deleteTank
};

// Create all standard tank hooks with a single factory call
const {
  useList: useTanksList,
  useById: useTankById,
  useCreate: useCreateTank,
  useUpdate: useUpdateTank,
  useDelete: useDeleteTank
} = createResourceHooks<FuelTank, TankFilters, CreateTankRequest, UpdateTankRequest>({
  resourceName: 'tanks',
  service: tanksResourceService,
  options: {
    staleTime: 5 * 60 * 1000, // 5 minutes
  }
});

/**
 * Hook for fetching fuel types for tank selection
 */
export function useFuelTypes() {
  return useApiQuery<FuelType[], Error>({
    queryKey: ['fuel-types'],
    queryFn: getFuelTypes,
    staleTime: 30 * 60 * 1000, // 30 minutes - fuel types change rarely
  });
}

/**
 * Hook for fetching tank level change history
 */
export function useTankLevelChanges(tankId: string) {
  return useApiQuery<TankLevelChange[], Error>({
    queryKey: ['tank-level-changes', tankId],
    queryFn: () => getTankLevelChanges(tankId),
    enabled: !!tankId,
    staleTime: 5 * 60 * 1000,
  });
}

// Define the type for the adjust tank level parameters
interface AdjustTankLevelParams {
  tankId: string;
  changeAmount: number;
  changeType: 'add' | 'subtract';
  reason?: string;
}

/**
 * Hook for adjusting tank level
 */
export function useAdjustTankLevel() {
  return useApiMutation<
    TankLevelChange,
    AdjustTankLevelParams
  >({
    mutationFn: ({ tankId, changeAmount, changeType, reason }) => 
      adjustTankLevel(tankId, {
        change_amount: changeAmount,
        change_type: changeType,
        reason
      }),
    invalidateQueries: [
      ['tanks'] as QueryKey,
      ['tanks', 'list'] as QueryKey,
      // Use proper static query keys instead of functions
      // or cast the query key arrays directly
    ],
    // Use onSuccessCallback for dynamic invalidation based on variables
    onSuccessCallback: (_, variables, _context, queryClient) => {
      queryClient.invalidateQueries({ queryKey: ['tank', variables.tankId] });
      queryClient.invalidateQueries({ queryKey: ['tank-level-changes', variables.tankId] });
    }
  });
}

/**
 * Backward compatible hook that matches the original useTanks API
 */
export function useTanks() {
  return useTanksList({});
}

/**
 * Backward compatible hook that matches the original useTank API
 */
export function useTank(id: string) {
  return useTankById(id);
}

/**
 * Backward compatible hook for tank mutations
 */
export function useTankMutations() {
  const createTankMutation = useCreateTank();
  const updateTankMutation = useUpdateTank();
  const deleteTankMutation = useDeleteTank();
  const adjustTankLevelMutation = useAdjustTankLevel();

  return {
    createTank: createTankMutation,
    updateTank: updateTankMutation,
    deleteTank: deleteTankMutation,
    adjustTankLevel: adjustTankLevelMutation
  };
}

/**
 * Convenience hook that combines all tanks hooks for easy use in components
 * (Backward compatible with the original implementation)
 */
export function useTanksManager() {
  const tanksQuery = useTanksList({});
  const fuelTypesQuery = useFuelTypes();
  const mutations = useTankMutations();
  
  // Compute combined loading state
  const isLoading = tanksQuery.isLoading || fuelTypesQuery.isLoading;
  
  // Compute combined error state
  const error = tanksQuery.error || fuelTypesQuery.error;
  
  return {
    // Data properties
    tanks: tanksQuery.data || [],
    fuelTypes: fuelTypesQuery.data || [],
    
    // Combined states
    isLoading,
    error,
    
    // Individual states
    isLoadingTanks: tanksQuery.isLoading,
    isLoadingFuelTypes: fuelTypesQuery.isLoading,
    tanksError: tanksQuery.error,
    fuelTypesError: fuelTypesQuery.error,
    
    // Mutations
    ...mutations,
    
    // Refetch functions
    refetchTanks: tanksQuery.refetch,
    refetchFuelTypes: fuelTypesQuery.refetch,
    
    // Refetch all
    refetchAll: () => {
      tanksQuery.refetch();
      fuelTypesQuery.refetch();
    }
  };
}

// Export both the backward compatible hooks and the new hooks
export {
  useTanksList,
  useTankById,
  useCreateTank,
  useUpdateTank,
  useDeleteTank
}; 