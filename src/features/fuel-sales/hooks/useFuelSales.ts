import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelSalesService } from '../services/fuelSalesService';
import type { FuelSale, FuelSaleFormData, FuelSaleFilters } from '../types/fuel-sales.types';

export function useFuelSales(filters?: FuelSaleFilters) {
  const queryClient = useQueryClient();

  const sales = useQuery({
    queryKey: ['fuel-sales', filters],
    queryFn: () => fuelSalesService.getSales(filters),
  });

  const createSale = useMutation({
    mutationFn: fuelSalesService.createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-sales'] });
    },
  });

  const updateSale = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FuelSaleFormData> }) =>
      fuelSalesService.updateSale(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-sales'] });
    },
  });

  const deleteSale = useMutation({
    mutationFn: fuelSalesService.deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-sales'] });
    },
  });

  const getSaleById = useQuery({
    queryKey: ['fuel-sale', 'id'],
    queryFn: () => fuelSalesService.getSaleById('id'),
    enabled: false,
  });

  return {
    sales: sales.data || [],
    isLoading: sales.isLoading,
    createSale,
    updateSale,
    deleteSale,
    getSaleById,
  };
} 