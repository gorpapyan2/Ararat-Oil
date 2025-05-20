import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petrolProvidersService } from '../services/petrolProvidersService';
import type { PetrolProvider, PetrolProviderFormData, PetrolProviderFilters } from '../types/petrol-providers.types';

export function usePetrolProviders(filters?: PetrolProviderFilters) {
  const queryClient = useQueryClient();

  const providers = useQuery({
    queryKey: ['petrol-providers', filters],
    queryFn: () => petrolProvidersService.getProviders(filters),
  });

  const createProvider = useMutation({
    mutationFn: petrolProvidersService.createProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petrol-providers'] });
    },
  });

  const updateProvider = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PetrolProviderFormData> }) =>
      petrolProvidersService.updateProvider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petrol-providers'] });
    },
  });

  const deleteProvider = useMutation({
    mutationFn: petrolProvidersService.deleteProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petrol-providers'] });
    },
  });

  return {
    providers: providers.data || [],
    isLoading: providers.isLoading,
    createProvider,
    updateProvider,
    deleteProvider,
  };
} 