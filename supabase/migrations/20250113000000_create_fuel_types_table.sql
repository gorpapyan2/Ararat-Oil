-- Create fuel_types table
CREATE TABLE IF NOT EXISTS public.fuel_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  code text UNIQUE,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fuel_types_name ON public.fuel_types(name);
CREATE INDEX IF NOT EXISTS idx_fuel_types_code ON public.fuel_types(code);
CREATE INDEX IF NOT EXISTS idx_fuel_types_is_active ON public.fuel_types(is_active);

-- Insert sample fuel types
INSERT INTO public.fuel_types (name, code, description, is_active) VALUES
('Petrol Regular', 'PETROL_92', 'Regular unleaded petrol 92 octane', true),
('Petrol Premium', 'PETROL_95', 'Premium unleaded petrol 95 octane', true),
('Petrol Super', 'PETROL_98', 'Super unleaded petrol 98 octane', true),
('Diesel', 'DIESEL', 'Automotive diesel fuel', true),
('CNG', 'CNG', 'Compressed Natural Gas', true),
('LPG', 'LPG', 'Liquefied Petroleum Gas', true)
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE public.fuel_types ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users to select fuel types" ON public.fuel_types
    FOR SELECT USING ((select auth.role()) = 'authenticated');

CREATE POLICY "Allow authenticated users to insert fuel types" ON public.fuel_types
    FOR INSERT WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "Allow authenticated users to update fuel types" ON public.fuel_types
    FOR UPDATE USING ((select auth.role()) = 'authenticated');

CREATE POLICY "Allow authenticated users to delete fuel types" ON public.fuel_types
    FOR DELETE USING ((select auth.role()) = 'authenticated'); 