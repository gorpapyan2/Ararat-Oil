-- Safely add fuel variants to the fuel_types table
INSERT INTO public.fuel_types (code, name) 
VALUES 
    ('petrol_regular', 'Regular Petrol'),
    ('petrol_premium', 'Premium Petrol')
ON CONFLICT (code) DO NOTHING;

-- Update existing fuel tanks with Regular or Premium in their name to use the new fuel type codes
DO $$
BEGIN
    -- Update only if the fuel_type_id column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'fuel_tanks' AND column_name = 'fuel_type_id'
    ) THEN
        -- Update Regular tanks
        UPDATE public.fuel_tanks
        SET fuel_type_id = (SELECT id FROM public.fuel_types WHERE code = 'petrol_regular')
        WHERE name ILIKE '%Regular%' AND fuel_type = 'petrol';

        -- Update Premium tanks
        UPDATE public.fuel_tanks
        SET fuel_type_id = (SELECT id FROM public.fuel_types WHERE code = 'petrol_premium')
        WHERE name ILIKE '%Premium%' AND fuel_type = 'petrol';
    END IF;
END $$;

-- Add a comment to explain the migration purpose if it doesn't already exist
COMMENT ON TABLE public.fuel_types IS 'Stores available fuel types in the system, including variants';

-- For safety, always drop the check constraint if it exists
ALTER TABLE public.fuel_tanks DROP CONSTRAINT IF EXISTS fuel_tanks_fuel_type_check;

-- Replace with a permissive constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.constraint_column_usage 
        WHERE table_name = 'fuel_tanks' AND constraint_name = 'fuel_tanks_fuel_type_check'
    ) THEN
        ALTER TABLE public.fuel_tanks ADD CONSTRAINT fuel_tanks_fuel_type_check CHECK (true);
    END IF;
END $$; 