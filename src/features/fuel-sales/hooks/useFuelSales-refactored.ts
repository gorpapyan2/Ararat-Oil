/**
 * Fuel Sales Hooks - Refactored Version
 *
 * This file demonstrates the migration from the old implementation to
 * the new standardized API hooks.
 */

/**
 * Fuel Sales Hooks - Refactored Version
 *
 * This file demonstrates the migration from the old implementation to
 * the new standardized API hooks.
 */

import { createResourceHooks, useApiQuery } from "@/hooks/api";
import type { ResourceService } from "@/hooks/api/types";
import {
  getFuelSales,
  getFuelSaleById,
  createFuelSale,
  updateFuelSale,
  deleteFuelSale,
  getLatestFuelSale,
  getFuelSalesCount,
  getFuelSalesSummary,
} from "../services";
import {
  FuelSale,
  FuelSaleFormData,
  FuelSaleFilters,
  FuelSaleSummary,
} from "../types";

// Adapt service to match ResourceService interface
const fuelSalesService: ResourceService<FuelSale, FuelSaleFilters, FuelSaleFormData, Partial<FuelSaleFormData>> = {
  getList: getFuelSales,
  getById: getFuelSaleById,
  create: createFuelSale,
  update: updateFuelSale,
  delete: deleteFuelSale,
};

// Create all standard fuel sales hooks with a single factory call
const {
  useList: useFuelSalesList,
  useById: useFuelSaleById,
  useCreate: useCreateFuelSale,
  useUpdate: useUpdateFuelSale,
  useDelete: useDeleteFuelSale,
} = createResourceHooks<
  FuelSale,
  FuelSaleFilters,
  FuelSaleFormData,
  Partial<FuelSaleFormData>
>({
  resourceName: "fuel-sales",
  service: fuelSalesService,
  options: {
    staleTime: 5 * 60 * 1000, // 5 minutes
  },
});

/**
 * Hook for fetching the latest sale for a filling system
 */
export function useLatestFuelSale(fillingSystemId: string) {
  return useApiQuery({
    queryKey: ["latest-fuel-sale", fillingSystemId],
    queryFn: () => getLatestFuelSale(fillingSystemId),
    enabled: !!fillingSystemId,
  });
}

/**
 * Hook for fetching sales count
 */
export function useFuelSalesCount() {
  return useApiQuery({
    queryKey: ["fuel-sales-count"],
    queryFn: getFuelSalesCount,
  });
}

/**
 * Hook for fetching sales summary
 */
export function useFuelSalesSummary(dateRange?: {
  start: string;
  end: string;
}) {
  return useApiQuery<FuelSaleSummary>({
    queryKey: ["fuel-sales-summary", dateRange],
    queryFn: () => getFuelSalesSummary(dateRange),
  });
}

/**
 * Backward compatible hook that combines multiple hooks
 * for a simpler migration path
 */
export function useFuelSales(filters?: FuelSaleFilters) {
  // Use the new hooks internally
  const fuelSales = useFuelSalesList(filters);

  return {
    // Make it compatible with the original API
    data: fuelSales.data || [],
    isLoading: fuelSales.isLoading,
    isError: fuelSales.isError,
    error: fuelSales.error,
    refetch: fuelSales.refetch,
  };
}

/**
 * Backward compatible hook for fetching a fuel sale by ID
 */
export function useFuelSaleByIdBackwardCompatible(id: string) {
  return useFuelSaleById(id);
}

/**
 * Backward compatible hook for creating a new fuel sale
 */
export function useCreateFuelSaleBackwardCompatible() {
  return useCreateFuelSale();
}

/**
 * Backward compatible hook for updating a fuel sale
 */
export function useUpdateFuelSaleBackwardCompatible() {
  return useUpdateFuelSale();
}

/**
 * Backward compatible hook for deleting a fuel sale
 */
export function useDeleteFuelSaleBackwardCompatible() {
  return useDeleteFuelSale();
}

// Export both old and new hooks
export {
  useFuelSalesList,
  useFuelSaleById,
  useCreateFuelSale,
  useUpdateFuelSale,
  useDeleteFuelSale,
};
