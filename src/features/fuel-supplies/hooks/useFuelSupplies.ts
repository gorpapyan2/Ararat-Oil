import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelSuppliesService } from '../services/fuelSuppliesService';
import type { FuelSupply, FuelSupplyFormData, FuelSupplyFilters } from '../types/fuel-supplies.types';

export function useFuelSupplies(filters?: FuelSupplyFilters) {
  const queryClient = useQueryClient();

  const supplies = useQuery({
    queryKey: ['fuel-supplies', filters],
    queryFn: () => fuelSuppliesService.getSupplies(filters),
  });

  const createSupply = useMutation({
    mutationFn: fuelSuppliesService.createSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-supplies'] });
    },
  });

  const updateSupply = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FuelSupplyFormData> }) =>
      fuelSuppliesService.updateSupply(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-supplies'] });
    },
  });

  const deleteSupply = useMutation({
    mutationFn: fuelSuppliesService.deleteSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-supplies'] });
    },
  });

  return {
    supplies: supplies.data || [],
    isLoading: supplies.isLoading,
    createSupply,
    updateSupply,
    deleteSupply,
  };
} 