-- Temporarily drop the constraint to allow any fuel_type value
ALTER TABLE public.fuel_tanks DROP CONSTRAINT IF EXISTS fuel_tanks_fuel_type_check;

-- Create a more permissive constraint that allows any string value
-- or completely remove the constraint if you want to rely only on the foreign key
ALTER TABLE public.fuel_tanks ADD CONSTRAINT fuel_tanks_fuel_type_check CHECK (true); 