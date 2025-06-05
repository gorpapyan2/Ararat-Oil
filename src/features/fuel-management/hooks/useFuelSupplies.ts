import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fuelSuppliesService } from "../services";
import type {
  FuelSupply,
  CreateFuelSupplyRequest,
  UpdateFuelSupplyRequest,
} from "../types";

export interface FuelSuppliesFilters {
  dateRange?: { from: Date; to: Date };
  providerId?: string;
  tankId?: string;
  paymentStatus?: string;
  searchQuery?: string;
}

export function useFuelSupplies(filters?: FuelSuppliesFilters) {
  const queryClient = useQueryClient();

  const supplies = useQuery({
    queryKey: ["fuel-supplies", filters],
    queryFn: () => fuelSuppliesService.getFuelSupplies(filters),
  });

  const createSupply = useMutation({
    mutationFn: (data: CreateFuelSupplyRequest) =>
      fuelSuppliesService.createFuelSupply(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
    },
  });

  const updateSupply = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFuelSupplyRequest }) =>
      fuelSuppliesService.updateFuelSupply(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
    },
  });

  const deleteSupply = useMutation({
    mutationFn: (id: string) => fuelSuppliesService.deleteFuelSupply(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
    },
  });

  return {
    supplies: supplies.data || [],
    isLoading: supplies.isLoading,
    isError: supplies.isError,
    error: supplies.error,
    createSupply,
    updateSupply,
    deleteSupply,
  };
}
