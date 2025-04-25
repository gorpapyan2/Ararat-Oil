import { supabase } from "@/integrations/supabase/client";
import { InventoryItem, FuelType } from "@/types";

export const fetchInventory = async (): Promise<InventoryItem[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('fuel_inventory')
      .select('*')
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching inventory:', error);
      throw new Error(error.message);
    }
    
    return (data || []).map(item => ({
      ...item,
      fuel_type: item.fuel_type as FuelType
    }));
  } catch (err: any) {
    console.error('Failed to fetch inventory:', err);
    throw new Error(err.message || 'Failed to fetch inventory data');
  }
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> => {
  try {
    const { data, error } = await supabase
      .from('fuel_inventory')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Error adding inventory item:', error);
      throw new Error(error.message);
    }

    return {
      ...data,
      fuel_type: data.fuel_type as FuelType
    };
  } catch (err: any) {
    console.error('Failed to add inventory item:', err);
    throw new Error(err.message || 'Failed to add inventory item');
  }
};

export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>): Promise<InventoryItem> => {
  try {
    const { data, error } = await supabase
      .from('fuel_inventory')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating inventory item:', error);
      throw new Error(error.message);
    }

    return {
      ...data,
      fuel_type: data.fuel_type as FuelType
    };
  } catch (err: any) {
    console.error('Failed to update inventory item:', err);
    throw new Error(err.message || 'Failed to update inventory item');
  }
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('fuel_inventory')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting inventory item:', error);
      throw new Error(error.message);
    }
  } catch (err: any) {
    console.error('Failed to delete inventory item:', err);
    throw new Error(err.message || 'Failed to delete inventory item');
  }
};
