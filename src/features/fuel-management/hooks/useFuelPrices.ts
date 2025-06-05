import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fuelPricesApi, FuelPrice, FuelPriceCreate, FuelPriceUpdate } from "@/core/api";
import {
  getFuelPrices,
  getFuelPriceById,
  createFuelPrice,
  updateFuelPrice,
  deleteFuelPrice,
  getCurrentPrices,
  getPriceSummary,
} from "../services";
import {
  FuelPriceFormData,
  FuelPriceFilters,
  FuelPriceSummary,
} from "../types";

// Define query keys
const QUERY_KEYS = {
  fuelPrices: "fuel-prices",
  fuelPriceById: (id: string) => ["fuel-price", id],
  currentPrices: "current-fuel-prices",
  priceSummary: "fuel-price-summary",
};

/**
 * Hook for fetching fuel prices with optional filters
 */
export function useFuelPrices(filters?: FuelPriceFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.fuelPrices, filters],
    queryFn: () => getFuelPrices(filters),
  });
}

/**
 * Hook for fetching a fuel price by ID
 */
export function useFuelPriceById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.fuelPriceById(id),
    queryFn: () => getFuelPriceById(id),
    enabled: !!id,
  });
}

/**
 * Hook for fetching current fuel prices
 */
export function useCurrentPrices() {
  return useQuery({
    queryKey: [QUERY_KEYS.currentPrices],
    queryFn: getCurrentPrices,
  });
}

/**
 * Hook for fetching fuel price summary statistics
 */
export function usePriceSummary() {
  return useQuery<FuelPriceSummary>({
    queryKey: [QUERY_KEYS.priceSummary],
    queryFn: async (): Promise<FuelPriceSummary> => {
      const response = await fuelPricesApi.getFuelPrices();
      const prices = response.data || [];
      
      // Create summary from fuel prices data
      const current_prices: Record<string, number> = {};
      prices.forEach(price => {
        if (price.status === 'active') {
          current_prices[price.fuel_type] = price.price_per_liter;
        }
      });

      return {
        current_prices,
        price_changes: {
          last_24h: 0,
          last_7d: 0,
          last_30d: 0,
        },
      };
    },
  });
}

/**
 * Hook for creating a new fuel price
 */
export function useCreateFuelPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FuelPriceFormData) => createFuelPrice(data),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.fuelPrices] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentPrices] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.priceSummary] });
    },
  });
}

/**
 * Hook for updating a fuel price
 */
export function useUpdateFuelPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<FuelPriceFormData>;
    }) => updateFuelPrice(id, data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.fuelPrices] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.fuelPriceById(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentPrices] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.priceSummary] });
    },
  });
}

/**
 * Hook for deleting a fuel price
 */
export function useDeleteFuelPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFuelPrice(id),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.fuelPrices] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentPrices] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.priceSummary] });
    },
  });
}
