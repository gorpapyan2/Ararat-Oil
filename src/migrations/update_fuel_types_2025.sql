-- Update existing fuel_prices table data to match new fuel types
BEGIN;

-- First, back up any data we might need to preserve
CREATE TABLE IF NOT EXISTS public.fuel_prices_backup AS
SELECT * FROM public.fuel_prices;

-- Enable Row Level Security for the backup table
ALTER TABLE public.fuel_prices_backup ENABLE ROW LEVEL SECURITY;

-- Create policies for the backup table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'fuel_prices_backup' AND policyname = 'Allow authenticated users to select fuel prices backup'
    ) THEN
        CREATE POLICY "Allow authenticated users to select fuel prices backup" ON public.fuel_prices_backup
            FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Delete obsolete fuel types
DELETE FROM public.fuel_prices
WHERE fuel_type NOT IN ('diesel', 'gas', 'petrol_regular', 'petrol_premium');

-- Map 'petrol' to 'petrol_regular' if needed (in case there's legacy data)
UPDATE public.fuel_prices
SET fuel_type = 'petrol_regular'
WHERE fuel_type = 'petrol';

-- Update fuel_types table
DELETE FROM public.fuel_types
WHERE code NOT IN ('diesel', 'gas', 'petrol_regular', 'petrol_premium');

-- Add comment to explain this migration
DO $$
BEGIN
    EXECUTE 'COMMENT ON TABLE public.fuel_prices_backup IS ''Backup of fuel_prices created during May 2025 migration to updated fuel types''';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Could not add comment to fuel_prices_backup table: %', SQLERRM;
END $$;

COMMIT; 