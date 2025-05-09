-- First, update existing records to ensure they match with fuel_types table codes
UPDATE public.fuel_prices
SET fuel_type = LOWER(fuel_type)
WHERE fuel_type != LOWER(fuel_type);

-- Add a new fuel_type_id column that will replace fuel_type text column
ALTER TABLE public.fuel_prices 
ADD COLUMN fuel_type_id UUID;

-- Populate the new column with corresponding IDs from the fuel_types table
UPDATE public.fuel_prices fp
SET fuel_type_id = ft.id
FROM public.fuel_types ft
WHERE fp.fuel_type = ft.code;

-- Make fuel_type_id NOT NULL once populated
ALTER TABLE public.fuel_prices 
ALTER COLUMN fuel_type_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE public.fuel_prices
ADD CONSTRAINT fk_fuel_prices_fuel_type
FOREIGN KEY (fuel_type_id)
REFERENCES public.fuel_types(id)
ON DELETE RESTRICT;

-- Create an index on the new foreign key column
CREATE INDEX IF NOT EXISTS idx_fuel_prices_fuel_type_id ON public.fuel_prices(fuel_type_id);

-- Update the existing index to include the new column instead of the old one
DROP INDEX IF EXISTS idx_fuel_prices_type_date;
CREATE INDEX IF NOT EXISTS idx_fuel_prices_type_date ON public.fuel_prices(fuel_type_id, effective_date DESC);

-- Keep the old column temporarily for backward compatibility
-- Later, after the application is updated, you can run a migration to remove the old column:
-- ALTER TABLE public.fuel_prices DROP COLUMN fuel_type; 