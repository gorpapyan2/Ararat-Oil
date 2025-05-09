-- First, update existing records to ensure they match with fuel_types table codes
UPDATE public.sales
SET fuel_type = LOWER(fuel_type)
WHERE fuel_type != LOWER(fuel_type);

-- Add a new fuel_type_id column that will replace fuel_type text column
ALTER TABLE public.sales 
ADD COLUMN fuel_type_id UUID;

-- Populate the new column with corresponding IDs from the fuel_types table
UPDATE public.sales s
SET fuel_type_id = ft.id
FROM public.fuel_types ft
WHERE s.fuel_type = ft.code;

-- Make fuel_type_id NOT NULL once populated
ALTER TABLE public.sales 
ALTER COLUMN fuel_type_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE public.sales
ADD CONSTRAINT fk_sales_fuel_type
FOREIGN KEY (fuel_type_id)
REFERENCES public.fuel_types(id)
ON DELETE RESTRICT;

-- Create an index on the new foreign key column
CREATE INDEX IF NOT EXISTS idx_sales_fuel_type_id ON public.sales(fuel_type_id);

-- Keep the old column temporarily for backward compatibility
-- Later, after the application is updated, you can run a migration to remove the old column:
-- ALTER TABLE public.sales DROP COLUMN fuel_type; 