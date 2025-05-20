import { create } from 'zustand';
import { SuppliesFilters } from '../types';

interface SuppliesFiltersState extends SuppliesFilters {
  setSearch: (search: string) => void;
  setDateRange: (range: { from: Date; to: Date } | undefined) => void;
  setProviderId: (id: string | undefined) => void;
  setTankId: (id: string | undefined) => void;
  setFuelType: (type: string | undefined) => void;
  setMinQuantity: (quantity: number | undefined) => void;
  setMaxQuantity: (quantity: number | undefined) => void;
  setMinPrice: (price: number | undefined) => void;
  setMaxPrice: (price: number | undefined) => void;
  setMinTotal: (total: number | undefined) => void;
  setMaxTotal: (total: number | undefined) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSort: (sortBy: string, direction: 'asc' | 'desc') => void;
  resetFilters: () => void;
}

const initialState: SuppliesFilters = {
  page: 1,
  pageSize: 25,
  sortBy: 'delivery_date',
  sortDirection: 'desc',
};

export const useSuppliesFilters = create<SuppliesFiltersState>((set) => ({
  ...initialState,

  setSearch: (search) => set({ search }),
  setDateRange: (dateRange) => set({ dateRange }),
  setProviderId: (providerId) => set({ providerId }),
  setTankId: (tankId) => set({ tankId }),
  setFuelType: (fuelType) => set({ fuelType }),
  setMinQuantity: (minQuantity) => set({ minQuantity }),
  setMaxQuantity: (maxQuantity) => set({ maxQuantity }),
  setMinPrice: (minPrice) => set({ minPrice }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setMinTotal: (minTotal) => set({ minTotal }),
  setMaxTotal: (maxTotal) => set({ maxTotal }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize }),
  setSort: (sortBy, sortDirection) => set({ sortBy, sortDirection }),
  resetFilters: () => set(initialState),
})); 