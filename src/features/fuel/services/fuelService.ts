import { supabase } from '@/lib/supabase';
import type { FuelTank, FuelSupply, FuelSale } from '../types/fuel.types';

export const fuelService = {
  // Tanks
  async getTanks() {
    const { data, error } = await supabase
      .from('fuel_tanks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as FuelTank[];
  },

  async createTank(tank: Omit<FuelTank, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('fuel_tanks')
      .insert(tank)
      .select()
      .single();

    if (error) throw error;
    return data as FuelTank;
  },

  async updateTank(id: string, tank: Partial<FuelTank>) {
    const { data, error } = await supabase
      .from('fuel_tanks')
      .update(tank)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as FuelTank;
  },

  // Supplies
  async getSupplies() {
    const { data, error } = await supabase
      .from('fuel_supplies')
      .select('*')
      .order('delivery_date', { ascending: false });

    if (error) throw error;
    return data as FuelSupply[];
  },

  async createSupply(supply: Omit<FuelSupply, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('fuel_supplies')
      .insert(supply)
      .select()
      .single();

    if (error) throw error;
    return data as FuelSupply;
  },

  async updateSupply(id: string, supply: Partial<FuelSupply>) {
    const { data, error } = await supabase
      .from('fuel_supplies')
      .update(supply)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as FuelSupply;
  },

  // Sales
  async getSales() {
    const { data, error } = await supabase
      .from('fuel_sales')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as FuelSale[];
  },

  async createSale(sale: Omit<FuelSale, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('fuel_sales')
      .insert(sale)
      .select()
      .single();

    if (error) throw error;
    return data as FuelSale;
  },

  async updateSale(id: string, sale: Partial<FuelSale>) {
    const { data, error } = await supabase
      .from('fuel_sales')
      .update(sale)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as FuelSale;
  },
}; 