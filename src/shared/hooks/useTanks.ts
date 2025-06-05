/**
 * Centralized Tank Hooks
 * 
 * This file contains all tank-related React Query hooks used across the application.
 * Import from this file instead of creating duplicate hook implementations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tanksApi } from "@/core/api";
import { useToast } from "@/hooks";
import type {
  Tank,
  TankCreate,
  TankUpdate,
  TankLevelChange,
  TankSummary,
  FuelType,
} from "@/shared/types/tank.types";

// Define query keys as constants for consistency
export const TANK_QUERY_KEYS = {
  tanks: ["tanks"] as const,
  tank: (id: string) => ["tank", id] as const,
  levelChanges: (tankId: string) => ["tank-level-changes", tankId] as const,
  fuelTypes: ["fuel-types"] as const,
  summary: ["tanks", "summary"] as const,
} as const;

/**
 * Hook for fetching all tanks
 * @returns Query object for tanks list
 */
export function useTanks() {
  return useQuery({
    queryKey: TANK_QUERY_KEYS.tanks,
    queryFn: async () => {
      const response = await tanksApi.getTanks();
      return response.data || [];
    },
  });
}

/**
 * Hook for fetching a tank by ID
 * @param id - Tank ID
 * @returns Query object for single tank
 */
export function useTank(id: string) {
  return useQuery({
    queryKey: TANK_QUERY_KEYS.tank(id),
    queryFn: async () => {
      const response = await tanksApi.getTankById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook for fetching tank level change history
 * @param tankId - Tank ID
 * @returns Query object for tank level changes
 */
export function useTankLevelChanges(tankId: string) {
  return useQuery({
    queryKey: TANK_QUERY_KEYS.levelChanges(tankId),
    queryFn: async () => {
      const response = await tanksApi.getTankLevelChanges(tankId);
      return response.data || [];
    },
    enabled: !!tankId,
  });
}

/**
 * Hook for fetching tank summary statistics
 * @returns Query object for tank summary
 */
export function useTankSummary() {
  return useQuery({
    queryKey: TANK_QUERY_KEYS.summary,
    queryFn: async () => {
      const response = await tanksApi.getTankSummary();
      return response.data;
    },
  });
}

/**
 * Hook for fetching fuel types for tank selection
 * @returns Query object for fuel types
 */
export function useFuelTypes() {
  return useQuery({
    queryKey: TANK_QUERY_KEYS.fuelTypes,
    queryFn: async () => {
      // TODO: Replace with actual API call when fuel types API is implemented
      return [
        { id: "1", name: "Petrol", code: "PET" },
        { id: "2", name: "Diesel", code: "DSL" },
        { id: "3", name: "Gas", code: "GAS" },
      ] as FuelType[];
    },
  });
}

/**
 * Hook for tank mutations (create, update, delete, adjust level)
 * @returns Mutation objects for tank operations
 */
export function useTankMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create tank mutation
  const createTankMutation = useMutation({
    mutationFn: async (data: TankCreate) => {
      const response = await tanksApi.createTank(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TANK_QUERY_KEYS.tanks });
      queryClient.invalidateQueries({ queryKey: TANK_QUERY_KEYS.summary });
      toast({
        title: "Success",
        description: "Tank created successfully",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create tank",
        variant: "error",
      });
    },
  });

  // Update tank mutation
  const updateTankMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TankUpdate }) => {
      const response = await tanksApi.updateTank(id, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: TANK_QUERY_KEYS.tanks });
      queryClient.invalidateQueries({ queryKey: TANK_QUERY_KEYS.tank(id) });
      queryClient.invalidateQueries({ queryKey: TANK_QUERY_KEYS.summary });
      toast({
        title: "Success",
        description: "Tank updated successfully",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update tank",
        variant: "error",
      });
    },
  });

  // Delete tank mutation
  const deleteTankMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await tanksApi.deleteTank(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TANK_QUERY_KEYS.tanks });
      queryClient.invalidateQueries({ queryKey: TANK_QUERY_KEYS.summary });
      toast({
        title: "Success",
        description: "Tank deleted successfully",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete tank",
        variant: "error",
      });
    },
  });

  // Adjust tank level mutation
  const adjustTankLevelMutation = useMutation({
    mutationFn: async ({
      tankId,
      changeAmount,
      changeType,
      reason,
    }: {
      tankId: string;
      changeAmount: number;
      changeType: "add" | "subtract";
      reason?: string;
    }) => {
      const response = await tanksApi.adjustTankLevel(tankId, changeAmount, changeType, reason);
      return response.data;
    },
    onSuccess: (_, { tankId }) => {
      queryClient.invalidateQueries({ queryKey: TANK_QUERY_KEYS.tanks });
      queryClient.invalidateQueries({ queryKey: TANK_QUERY_KEYS.tank(tankId) });
      queryClient.invalidateQueries({ queryKey: TANK_QUERY_KEYS.levelChanges(tankId) });
      queryClient.invalidateQueries({ queryKey: TANK_QUERY_KEYS.summary });
      toast({
        title: "Success",
        description: "Tank level adjusted successfully",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to adjust tank level",
        variant: "error",
      });
    },
  });

  return {
    createTank: createTankMutation,
    updateTank: updateTankMutation,
    deleteTank: deleteTankMutation,
    adjustTankLevel: adjustTankLevelMutation,
  };
}

/**
 * Convenience hook that combines all tanks hooks for easy use in components
 * @returns Combined query results and mutation functions
 */
export function useTanksManager() {
  const tanksQuery = useTanks();
  const fuelTypesQuery = useFuelTypes();
  const summaryQuery = useTankSummary();
  const mutations = useTankMutations();

  // Compute combined loading state
  const isLoading = tanksQuery.isLoading || fuelTypesQuery.isLoading || summaryQuery.isLoading;

  // Compute combined error state
  const error = tanksQuery.error || fuelTypesQuery.error || summaryQuery.error;

  return {
    // Data properties
    tanks: tanksQuery.data || [],
    fuelTypes: fuelTypesQuery.data || [],
    summary: summaryQuery.data,

    // Combined states
    isLoading,
    error,

    // Individual states
    isLoadingTanks: tanksQuery.isLoading,
    isLoadingFuelTypes: fuelTypesQuery.isLoading,
    isLoadingSummary: summaryQuery.isLoading,
    tanksError: tanksQuery.error,
    fuelTypesError: fuelTypesQuery.error,
    summaryError: summaryQuery.error,

    // Mutations
    ...mutations,

    // Refetch functions
    refetchTanks: tanksQuery.refetch,
    refetchFuelTypes: fuelTypesQuery.refetch,
    refetchSummary: summaryQuery.refetch,

    // Refetch all
    refetchAll: () => {
      tanksQuery.refetch();
      fuelTypesQuery.refetch();
      summaryQuery.refetch();
    },
  };
} 