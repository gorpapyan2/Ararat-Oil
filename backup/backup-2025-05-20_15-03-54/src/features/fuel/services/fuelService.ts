import { supabase } from '@/services/supabase';
import type { FuelTank, FuelSupply, FuelSale } from '../types/fuel.types';
import type { Database } from '@/types/supabase';

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
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    // Transform the data to match our FuelSale type
    return (data || []).map(sale => ({
      id: sale.id,
      tank_id: (sale.filling_system_id ? 
        // In a real implementation, we would fetch the tank_id from the filling_system
        'unknown_tank' : 'unknown_tank'), 
      quantity_liters: sale.total_sold_liters || 0,
      price_per_liter: sale.price_per_unit || 0,
      total_amount: sale.total_sales || 0,
      payment_method: sale.payment_status || 'unknown',
      payment_status: sale.payment_status || 'unknown',
      sale_date: sale.date,
      customer_name: 'Unknown', // This field doesn't exist in the actual sales table
      created_at: sale.created_at || new Date().toISOString(),
      updated_at: sale.created_at || new Date().toISOString()
    })) as FuelSale[];
  },

  async createSale(sale: Omit<FuelSale, 'id' | 'created_at' | 'updated_at'>) {
    // Transform the FuelSale to match our actual sales table schema
    const dbSale = {
      date: sale.sale_date,
      total_sales: sale.total_amount,
      price_per_unit: sale.price_per_liter,
      total_sold_liters: sale.quantity_liters,
      payment_status: sale.payment_status || 'pending'
    };

    const { data, error } = await supabase
      .from('sales')
      .insert(dbSale)
      .select()
      .single();

    if (error) throw error;

    // Transform back to FuelSale
    return {
      id: data.id,
      tank_id: 'unknown_tank', 
      quantity_liters: data.total_sold_liters || 0,
      price_per_liter: data.price_per_unit,
      total_amount: data.total_sales,
      payment_method: data.payment_status || 'unknown',
      payment_status: data.payment_status || 'unknown',
      sale_date: data.date,
      customer_name: 'Unknown',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.created_at || new Date().toISOString()
    } as FuelSale;
  },

  async updateSale(id: string, sale: Partial<FuelSale>) {
    // First fetch the current sale to get existing values
    const { data: currentSale, error: fetchError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;

    // Transform the FuelSale to match our actual sales table schema
    // Include required fields from the current sale if not provided in update
    const dbSale = {
      date: sale.sale_date || currentSale.date,
      total_sales: sale.total_amount || currentSale.total_sales,
      price_per_unit: sale.price_per_liter || currentSale.price_per_unit,
      total_sold_liters: sale.quantity_liters ?? currentSale.total_sold_liters, // Use nullish coalescing
      payment_status: sale.payment_status || currentSale.payment_status
    };

    const { data, error } = await supabase
      .from('sales')
      .update(dbSale)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Transform back to FuelSale
    return {
      id: data.id,
      tank_id: 'unknown_tank',
      quantity_liters: data.total_sold_liters || 0,
      price_per_liter: data.price_per_unit,
      total_amount: data.total_sales,
      payment_method: data.payment_status || 'unknown',
      payment_status: data.payment_status || 'unknown',
      sale_date: data.date,
      customer_name: 'Unknown',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.created_at || new Date().toISOString()
    } as FuelSale;
  },
}; 