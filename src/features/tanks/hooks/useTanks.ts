import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tanksApi } from "@/core/api";
import { useToast } from "@/hooks";
import type {
  FuelTank,
  TankLevelChange,
  CreateTankRequest,
  UpdateTankRequest,
  FuelType,
} from "../types/tanks.types";

// Define query keys as array strings for consistency
const QUERY_KEYS = {
  tanks: ["tanks"],
  tank: (id: string) => ["tank", id],
  levelChanges: (tankId: string) => ["tank-level-changes", tankId],
  fuelTypes: ["fuel-types"],
};

/**
 * Hook for fetching all tanks
 * @returns Query object for tanks list
 */
export function useTanks() {
  return useQuery({
    queryKey: ["tanks"],
    queryFn: async () => {
      const response = await tanksApi.getTanks();
      return response.data;
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
    queryKey: ["tank", id],
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
    queryKey: ["tank-level-changes", tankId],
    queryFn: async () => {
      const response = await tanksApi.getTankLevelChanges(tankId);
      return response.data;
    },
    enabled: !!tankId,
  });
}

/**
 * Hook for fetching fuel types for tank selection
 * @returns Query object for fuel types
 */
export function useFuelTypes() {
  return useQuery({
    queryKey: ["fuel-types"],
    queryFn: async () => {
      // For now, return mock data until fuel types API is implemented
      return [
        { id: "1", name: "Petrol" },
        { id: "2", name: "Diesel" },
        { id: "3", name: "Kerosene" },
      ];
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
    mutationFn: async (data: CreateTankRequest) => {
      const response = await tanksApi.createTank(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tanks"] });
      toast({
        title: "Success",
        description: "Tank created successfully",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create tank",
        variant: "error",
      });
    },
  });

  // Update tank mutation
  const updateTankMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTankRequest }) => {
      const response = await tanksApi.updateTank(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tanks"] });
      toast({
        title: "Success",
        description: "Tank updated successfully",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update tank",
        variant: "error",
      });
    },
  });

  // Delete tank mutation
  const deleteTankMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await tanksApi.deleteTank(id);
      return response.data?.success || false;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tanks"] });
      toast({
        title: "Success",
        description: "Tank deleted successfully",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete tank",
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tanks"] });
      queryClient.invalidateQueries({ queryKey: ["tank", variables.tankId] });
      queryClient.invalidateQueries({ queryKey: ["tank-level-changes", variables.tankId] });
      toast({
        title: "Success",
        description: "Tank level adjusted successfully",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to adjust tank level",
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
    },
  };
}
