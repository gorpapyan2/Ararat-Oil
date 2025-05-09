-- Add fuel variants to the fuel_types table
INSERT INTO public.fuel_types (code, name) 
VALUES 
    ('petrol_regular', 'Regular Petrol'),
    ('petrol_premium', 'Premium Petrol')
ON CONFLICT (code) DO NOTHING;

-- Update existing fuel tanks with Regular or Premium in their name to use the new fuel type codes
UPDATE public.fuel_tanks
SET fuel_type_id = (SELECT id FROM public.fuel_types WHERE code = 'petrol_regular')
WHERE name ILIKE '%Regular%' AND fuel_type = 'petrol';

UPDATE public.fuel_tanks
SET fuel_type_id = (SELECT id FROM public.fuel_types WHERE code = 'petrol_premium')
WHERE name ILIKE '%Premium%' AND fuel_type = 'petrol';

-- Add a comment to explain the migration purpose
COMMENT ON TABLE public.fuel_types IS 'Stores available fuel types in the system, including variants'; 