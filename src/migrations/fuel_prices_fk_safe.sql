-- Safe migration to add fuel_type_id if it doesn't exist
DO $$
BEGIN
    -- Check if the column exists before trying to add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'fuel_prices' AND column_name = 'fuel_type_id'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE public.fuel_prices ADD COLUMN fuel_type_id UUID;
        
        -- First, update existing records to ensure they match with fuel_types table codes
        UPDATE public.fuel_prices
        SET fuel_type = LOWER(fuel_type)
        WHERE fuel_type != LOWER(fuel_type);
        
        -- Populate the new column with corresponding IDs from the fuel_types table
        UPDATE public.fuel_prices fp
        SET fuel_type_id = ft.id
        FROM public.fuel_types ft
        WHERE fp.fuel_type = ft.code;
        
        -- Make fuel_type_id NOT NULL once populated
        ALTER TABLE public.fuel_prices 
        ALTER COLUMN fuel_type_id SET NOT NULL;
        
        -- Add foreign key constraint if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_fuel_prices_fuel_type'
        ) THEN
            ALTER TABLE public.fuel_prices
            ADD CONSTRAINT fk_fuel_prices_fuel_type
            FOREIGN KEY (fuel_type_id)
            REFERENCES public.fuel_types(id)
            ON DELETE RESTRICT;
        END IF;
        
        -- Create an index on the new foreign key column
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_indexes 
            WHERE indexname = 'idx_fuel_prices_fuel_type_id'
        ) THEN
            CREATE INDEX idx_fuel_prices_fuel_type_id ON public.fuel_prices(fuel_type_id);
        END IF;
    END IF;
    
    -- Update the existing index to include the new column instead of the old one
    IF EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE indexname = 'idx_fuel_prices_type_date'
    ) THEN
        DROP INDEX IF EXISTS idx_fuel_prices_type_date;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE indexname = 'idx_fuel_prices_type_date'
    ) THEN
        CREATE INDEX idx_fuel_prices_type_date ON public.fuel_prices(fuel_type_id, effective_date DESC);
    END IF;
END $$;

-- Note: Keep the old column temporarily for backward compatibility
-- Later, after the application is updated, you can run a migration to remove the old column:
-- ALTER TABLE public.fuel_prices DROP COLUMN fuel_type; 