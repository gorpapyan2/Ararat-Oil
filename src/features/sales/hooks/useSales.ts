
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi } from '@/core/api/endpoints/sales';
import { useToast } from '@/core/hooks/useToast';
import type { Sale } from '@/core/api/types';

/**
 * Hook for managing sales data
 */
export function useSales() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all sales
  const {
    data: sales = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await salesApi.getSales();
      return response.data || [];
    },
  });

  // Create sale mutation
  const createSaleMutation = useMutation({
    mutationFn: (saleData: Partial<Sale>) => salesApi.createSale(saleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast({
        title: 'Success',
        description: 'Sale created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create sale',
        variant: 'destructive',
      });
    },
  });

  // Update sale mutation
  const updateSaleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Sale> }) => 
      salesApi.updateSale(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast({
        title: 'Success',
        description: 'Sale updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update sale',
        variant: 'destructive',
      });
    },
  });

  // Delete sale mutation
  const deleteSaleMutation = useMutation({
    mutationFn: (id: string) => salesApi.deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast({
        title: 'Success',
        description: 'Sale deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete sale',
        variant: 'destructive',
      });
    },
  });

  return {
    sales,
    isLoading,
    error,
    refetch,
    createSale: createSaleMutation.mutate,
    updateSale: updateSaleMutation.mutate,
    deleteSale: deleteSaleMutation.mutate,
    isCreating: createSaleMutation.isPending,
    isUpdating: updateSaleMutation.isPending,
    isDeleting: deleteSaleMutation.isPending,
  };
}
