import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelService } from '../services/fuelService';
import type { FuelTank, FuelSupply, FuelSale } from '../types/fuel.types';

export function useFuel() {
  const queryClient = useQueryClient();

  // Tanks
  const tanks = useQuery({
    queryKey: ['tanks'],
    queryFn: fuelService.getTanks,
  });

  const createTank = useMutation({
    mutationFn: fuelService.createTank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tanks'] });
    },
  });

  const updateTank = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FuelTank> }) =>
      fuelService.updateTank(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tanks'] });
    },
  });

  // Supplies
  const supplies = useQuery({
    queryKey: ['supplies'],
    queryFn: fuelService.getSupplies,
  });

  const createSupply = useMutation({
    mutationFn: fuelService.createSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
    },
  });

  const updateSupply = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FuelSupply> }) =>
      fuelService.updateSupply(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplies'] });
    },
  });

  // Sales
  const sales = useQuery({
    queryKey: ['sales'],
    queryFn: fuelService.getSales,
  });

  const createSale = useMutation({
    mutationFn: fuelService.createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
  });

  const updateSale = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FuelSale> }) =>
      fuelService.updateSale(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
  });

  return {
    // Tanks
    tanks: tanks.data || [],
    isLoadingTanks: tanks.isLoading,
    createTank,
    updateTank,

    // Supplies
    supplies: supplies.data || [],
    isLoadingSupplies: supplies.isLoading,
    createSupply,
    updateSupply,

    // Sales
    sales: sales.data || [],
    isLoadingSales: sales.isLoading,
    createSale,
    updateSale,
  };
} 