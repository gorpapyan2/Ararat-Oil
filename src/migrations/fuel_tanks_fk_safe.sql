-- Safe migration for fuel tanks foreign key
DO $$
BEGIN
    -- Check if the column exists before trying to add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'fuel_tanks' AND column_name = 'fuel_type_id'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE public.fuel_tanks ADD COLUMN fuel_type_id UUID;
        
        -- First, update existing records to ensure they match with fuel_types table codes
        UPDATE public.fuel_tanks
        SET fuel_type = LOWER(fuel_type)
        WHERE fuel_type != LOWER(fuel_type);
        
        -- Populate the new column with corresponding IDs from the fuel_types table
        UPDATE public.fuel_tanks ft
        SET fuel_type_id = ftp.id
        FROM public.fuel_types ftp
        WHERE ft.fuel_type = ftp.code;
        
        -- Make fuel_type_id NOT NULL once populated
        ALTER TABLE public.fuel_tanks 
        ALTER COLUMN fuel_type_id SET NOT NULL;
        
        -- Add foreign key constraint if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.table_constraints 
            WHERE constraint_name = 'fk_fuel_tanks_fuel_type'
        ) THEN
            ALTER TABLE public.fuel_tanks
            ADD CONSTRAINT fk_fuel_tanks_fuel_type
            FOREIGN KEY (fuel_type_id)
            REFERENCES public.fuel_types(id)
            ON DELETE RESTRICT;
        END IF;
        
        -- Create an index on the new foreign key column
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_indexes 
            WHERE indexname = 'idx_fuel_tanks_fuel_type_id'
        ) THEN
            CREATE INDEX idx_fuel_tanks_fuel_type_id ON public.fuel_tanks(fuel_type_id);
        END IF;
    END IF;
END $$;

-- Note: Keep the old column temporarily for backward compatibility
-- Later, after the application is updated, you can run a migration to remove the old column:
-- ALTER TABLE public.fuel_tanks DROP COLUMN fuel_type; 