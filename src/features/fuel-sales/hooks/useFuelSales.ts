import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// Define query keys
const QUERY_KEYS = {
  fuelSales: "fuel-sales",
  fuelSaleById: (id: string) => ["fuel-sale", id],
  latestFuelSale: (fillingSystemId: string) => [
    "latest-fuel-sale",
    fillingSystemId,
  ],
  fuelSalesCount: "fuel-sales-count",
  fuelSalesSummary: "fuel-sales-summary",
};

/**
 * Hook for fetching fuel sales with optional filters
 */
export function useFuelSales(filters?: FuelSaleFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.fuelSales, filters],
    queryFn: () => getFuelSales(filters),
  });
}

/**
 * Hook for fetching a fuel sale by ID
 */
export function useFuelSaleById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.fuelSaleById(id),
    queryFn: () => getFuelSaleById(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching the latest sale for a filling system
 */
export function useLatestFuelSale(fillingSystemId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.latestFuelSale(fillingSystemId),
    queryFn: () => getLatestFuelSale(fillingSystemId),
    enabled: !!fillingSystemId,
  });
}

/**
 * Hook for fetching sales count
 */
export function useFuelSalesCount() {
  return useQuery({
    queryKey: [QUERY_KEYS.fuelSalesCount],
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
  return useQuery<FuelSaleSummary>({
    queryKey: [QUERY_KEYS.fuelSalesSummary, dateRange],
    queryFn: () => getFuelSalesSummary(dateRange),
  });
}

/**
 * Hook for creating a new fuel sale
 */
export function useCreateFuelSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FuelSaleFormData) => createFuelSale(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.fuelSales] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.fuelSalesCount] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.fuelSalesSummary],
      });
    },
  });
}

/**
 * Hook for updating a fuel sale
 */
export function useUpdateFuelSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<FuelSaleFormData>;
    }) => updateFuelSale(id, data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.fuelSales] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.fuelSaleById(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.fuelSalesCount] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.fuelSalesSummary],
      });
    },
  });
}

/**
 * Hook for deleting a fuel sale
 */
export function useDeleteFuelSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFuelSale(id),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.fuelSales] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.fuelSalesCount] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.fuelSalesSummary],
      });
    },
  });
}
