import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTanks,
  getTankById,
  getTankLevelChanges,
  createTank,
  updateTank,
  deleteTank,
  getFuelTypes,
  adjustTankLevel
} from '../services';
import type { FuelTank, TankLevelChange, CreateTankRequest, UpdateTankRequest, FuelType } from '../types/tanks.types';

// Define query keys as array strings for consistency
const QUERY_KEYS = {
  tanks: ['tanks'],
  tank: (id: string) => ['tank', id],
  levelChanges: (tankId: string) => ['tank-level-changes', tankId],
  fuelTypes: ['fuel-types']
};

/**
 * Hook for fetching all tanks
 * @returns Query object for tanks list
 */
export function useTanks() {
  return useQuery<FuelTank[], Error>({
    queryKey: QUERY_KEYS.tanks,
    queryFn: getTanks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching a tank by ID
 * @param id - Tank ID
 * @returns Query object for single tank
 */
export function useTank(id: string) {
  return useQuery<FuelTank, Error>({
    queryKey: QUERY_KEYS.tank(id),
    queryFn: () => getTankById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching tank level change history
 * @param tankId - Tank ID
 * @returns Query object for tank level changes
 */
export function useTankLevelChanges(tankId: string) {
  return useQuery<TankLevelChange[], Error>({
    queryKey: QUERY_KEYS.levelChanges(tankId),
    queryFn: () => getTankLevelChanges(tankId),
    enabled: !!tankId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching fuel types for tank selection
 * @returns Query object for fuel types
 */
export function useFuelTypes() {
  return useQuery<FuelType[], Error>({
    queryKey: QUERY_KEYS.fuelTypes,
    queryFn: getFuelTypes,
    staleTime: 30 * 60 * 1000, // 30 minutes - fuel types change rarely
  });
}

/**
 * Hook for tank mutations (create, update, delete, adjust level)
 * @returns Mutation objects for tank operations
 */
export function useTankMutations() {
  const queryClient = useQueryClient();

  // Create tank mutation
  const createTankMutation = useMutation<
    FuelTank,
    Error,
    CreateTankRequest
  >({
    mutationFn: createTank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tanks });
    }
  });

  // Update tank mutation
  const updateTankMutation = useMutation<
    FuelTank,
    Error,
    { id: string; data: UpdateTankRequest }
  >({
    mutationFn: ({ id, data }) => updateTank(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tanks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tank(variables.id) });
    }
  });

  // Delete tank mutation
  const deleteTankMutation = useMutation<
    boolean,
    Error,
    string
  >({
    mutationFn: deleteTank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tanks });
    }
  });

  // Adjust tank level mutation
  const adjustTankLevelMutation = useMutation<
    TankLevelChange,
    Error,
    { 
      tankId: string; 
      changeAmount: number; 
      changeType: 'add' | 'subtract'; 
      reason?: string 
    }
  >({
    mutationFn: ({ 
      tankId, 
      changeAmount, 
      changeType, 
      reason 
    }) => adjustTankLevel(tankId, {
      change_amount: changeAmount,
      change_type: changeType,
      reason
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tanks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tank(variables.tankId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.levelChanges(variables.tankId) });
    }
  });

  return {
    createTank: createTankMutation,
    updateTank: updateTankMutation,
    deleteTank: deleteTankMutation,
    adjustTankLevel: adjustTankLevelMutation
  };
}

/**
 * Convenience hook that combines all tanks hooks for easy use in components
 * @returns Combined query results and mutation functions
 */
export function useTanksManager() {
  const tanksQuery = useTanks();
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