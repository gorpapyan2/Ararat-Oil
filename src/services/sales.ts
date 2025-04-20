
export const fetchSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      filling_system:filling_systems(
        name,
        tank:fuel_tanks(
          fuel_type
        )
      )
    `)
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  return (data || []).map(item => ({
    id: item.id,
    date: item.date,
    fuel_type: item.filling_system?.tank?.fuel_type as FuelType || 'Petrol',
    quantity: item.total_sold_liters || 0,
    price_per_unit: item.price_per_unit,
    total_sales: item.total_sales,
    payment_status: 'Pending', // Hardcoded since it's not in the database
    filling_system_name: item.filling_system?.name || 'Unknown',
    created_at: item.created_at,
    meter_start: item.meter_start,
    meter_end: item.meter_end,
    filling_system_id: item.filling_system_id,
    employee_id: item.employee_id
  }));
};
