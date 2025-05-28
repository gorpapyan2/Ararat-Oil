/**
 * Fuel Supplies Hooks - Refactored Version
 *
 * This file demonstrates the migration from the old implementation to
 * the new standardized API hooks.
 */

import { createResourceHooks } from "@/hooks/api";
import { fuelSuppliesService } from "../services";
import type {
  FuelSupply,
  CreateFuelSupplyRequest,
  UpdateFuelSupplyRequest,
} from "../types";

// Define the filters interface
export interface FuelSuppliesFilters {
  dateRange?: { from: Date; to: Date };
  providerId?: string;
  tankId?: string;
  paymentStatus?: string;
  searchQuery?: string;
}

// Adapt service to match ResourceService interface
const fuelSupplyService = {
  getList: fuelSuppliesService.getFuelSupplies,
  getById: fuelSuppliesService.getFuelSupplyById,
  create: fuelSuppliesService.createFuelSupply,
  update: fuelSuppliesService.updateFuelSupply,
  delete: fuelSuppliesService.deleteFuelSupply,
  // If summary exists, add it here
  // getSummary: fuelSuppliesService.getFuelSuppliesSummary
};

// Create all fuel supplies hooks with a single factory call
const {
  useList: useFuelSuppliesList,
  useById: useFuelSupplyById,
  useCreate: useCreateFuelSupply,
  useUpdate: useUpdateFuelSupply,
  useDelete: useDeleteFuelSupply,
} = createResourceHooks<
  FuelSupply,
  FuelSuppliesFilters,
  CreateFuelSupplyRequest,
  UpdateFuelSupplyRequest
>({
  resourceName: "fuel-supplies",
  service: fuelSupplyService,
  options: {
    staleTime: 5 * 60 * 1000, // 5 minutes
  },
});

/**
 * Backward compatible hook that combines multiple hooks
 * for a simpler migration path
 */
export function useFuelSupplies(filters?: FuelSuppliesFilters) {
  // Use the new hooks internally
  const supplies = useFuelSuppliesList(filters);
  const createSupplyMutation = useCreateFuelSupply();
  const updateSupplyMutation = useUpdateFuelSupply();
  const deleteSupplyMutation = useDeleteFuelSupply();

  // Return an API that matches the old implementation
  return {
    supplies: supplies.data || [],
    isLoading: supplies.isLoading,
    isError: supplies.isError,
    error: supplies.error,

    // Expose the mutations with the same API
    createSupply: createSupplyMutation,
    updateSupply: updateSupplyMutation,
    deleteSupply: deleteSupplyMutation,

    // Add refetch for convenience
    refetchSupplies: supplies.refetch,
  };
}

// Export individual hooks for more granular usage
export {
  useFuelSuppliesList,
  useFuelSupplyById,
  useCreateFuelSupply,
  useUpdateFuelSupply,
  useDeleteFuelSupply,
};
