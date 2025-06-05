-- Create fuel_supplies table
CREATE TABLE IF NOT EXISTS public.fuel_supplies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  delivery_date timestamp NOT NULL,
  provider_id uuid NOT NULL,
  tank_id uuid NOT NULL,
  quantity_liters numeric NOT NULL,
  price_per_liter numeric NOT NULL,
  total_cost numeric NOT NULL,
  shift_id uuid,
  comments text,
  payment_method text,
  payment_status text DEFAULT 'pending',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_delivery_date ON public.fuel_supplies(delivery_date);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_provider_id ON public.fuel_supplies(provider_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_tank_id ON public.fuel_supplies(tank_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_shift_id ON public.fuel_supplies(shift_id);

-- Insert some sample data for testing
INSERT INTO public.fuel_supplies (
  delivery_date,
  provider_id,
  tank_id,
  quantity_liters,
  price_per_liter,
  total_cost,
  shift_id,
  comments,
  payment_method,
  payment_status
) VALUES 
(
  '2025-05-11'::timestamp,
  (SELECT id FROM public.petrol_providers LIMIT 1),
  (SELECT id FROM public.fuel_tanks LIMIT 1),
  1500,
  0.85,
  1275,
  (SELECT id FROM public.shifts LIMIT 1),
  'Regular fuel delivery',
  'bank_transfer',
  'completed'
),
(
  '2025-05-08'::timestamp,
  (SELECT id FROM public.petrol_providers LIMIT 1),
  (SELECT id FROM public.fuel_tanks LIMIT 1),
  2000,
  0.87,
  1740,
  (SELECT id FROM public.shifts LIMIT 1),
  'Emergency fuel delivery',
  'cash',
  'pending'
); 