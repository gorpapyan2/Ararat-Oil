import type { StateCreator } from "zustand";

/**
 * Common store slice types
 */
export type StoreSlice<T> = StateCreator<
  T,
  [],
  [],
  T
>;

/**
 * Base entity interface for stores
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Generic CRUD store interface
 */
export interface CrudStore<T extends BaseEntity> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setItems: (items: T[]) => void;
  addItem: (item: T) => void;
  updateItem: (id: string, updates: Partial<T>) => void;
  removeItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
} 