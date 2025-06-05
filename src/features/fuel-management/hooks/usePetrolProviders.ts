import { petrolProvidersApi, PetrolProvider, CreateProviderRequest, UpdateProviderRequest } from "@/core/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  PetrolProviderFormData,
  PetrolProviderFilters,
} from "../types/petrol-providers.types";

export function usePetrolProviders(filters?: PetrolProviderFilters) {
  return useQuery({
    queryKey: ["petrol-providers", filters],
    queryFn: () => petrolProvidersApi.getPetrolProviders(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreatePetrolProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PetrolProviderFormData) => 
      petrolProvidersApi.createPetrolProvider({
        ...data,
        status: "active" // Add default status since it's required by CreateProviderRequest
      } as CreateProviderRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
    },
  });
}

export function useUpdatePetrolProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PetrolProviderFormData> }) =>
      petrolProvidersApi.updatePetrolProvider(id, data as UpdateProviderRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
    },
  });
}

export function useDeletePetrolProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => petrolProvidersApi.deletePetrolProvider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petrol-providers"] });
    },
  });
}
