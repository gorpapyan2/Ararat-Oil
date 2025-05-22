import { supabase } from '@/services/supabase';
import { PetrolProvider, PetrolProviderFormData, PetrolProviderFilters, PetrolProviderSummary } from '../types/petrol-providers.types';

const EDGE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/petrol-providers`;

export const petrolProvidersService = {
  async getProviders(filters?: PetrolProviderFilters) {
    try {
      const { data, error } = await supabase.functions.invoke('petrol-providers/providers', {
        method: 'GET',
        body: { filters },
      });

      if (error) throw error;
      return data.providers as PetrolProvider[];
    } catch (error) {
      console.error('Error fetching petrol providers:', error);
      throw error;
    }
  },

  async createProvider(provider: PetrolProviderFormData) {
    try {
      const { data, error } = await supabase.functions.invoke('petrol-providers/providers', {
        method: 'POST',
        body: provider,
      });

      if (error) throw error;
      return data.provider as PetrolProvider;
    } catch (error) {
      console.error('Error creating petrol provider:', error);
      throw error;
    }
  },

  async updateProvider(id: string, provider: Partial<PetrolProviderFormData>) {
    try {
      const { data, error } = await supabase.functions.invoke('petrol-providers/providers', {
        method: 'PUT',
        body: { id, ...provider },
      });

      if (error) throw error;
      return data.provider as PetrolProvider;
    } catch (error) {
      console.error('Error updating petrol provider:', error);
      throw error;
    }
  },

  async deleteProvider(id: string) {
    try {
      const { error } = await supabase.functions.invoke('petrol-providers/providers', {
        method: 'DELETE',
        body: { id },
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting petrol provider:', error);
      throw error;
    }
  },

  async getSummary() {
    try {
      const { data, error } = await supabase.functions.invoke('petrol-providers/summary', {
        method: 'GET',
      });

      if (error) throw error;
      return data.summary as PetrolProviderSummary;
    } catch (error) {
      console.error('Error fetching petrol providers summary:', error);
      throw error;
    }
  },
}; 