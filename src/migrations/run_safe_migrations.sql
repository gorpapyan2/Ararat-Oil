-- Master migration file to run all fuel type migrations in correct order

-- Step 1: First ensure the fuel_types table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fuel_types') THEN
        -- Create fuel_types table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.fuel_types (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            code TEXT NOT NULL UNIQUE CHECK (code ~ '^[a-z0-9_-]+$'),
            name TEXT NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        -- Insert default fuel types
        INSERT INTO public.fuel_types (code, name) 
        VALUES 
            ('petrol', 'Petrol'),
            ('diesel', 'Diesel'),
            ('gas', 'Gas'),
            ('kerosene', 'Kerosene'),
            ('cng', 'CNG')
        ON CONFLICT (code) DO NOTHING;
        
        -- Create an index on code for faster lookups
        CREATE INDEX IF NOT EXISTS idx_fuel_types_code ON public.fuel_types(code);
        
        -- Add a comment to the table
        COMMENT ON TABLE public.fuel_types IS 'Stores available fuel types in the system';
    END IF;
END $$;

-- Step 2: Add fuel variants (regular/premium)
INSERT INTO public.fuel_types (code, name) 
VALUES 
    ('petrol_regular', 'Regular Petrol'),
    ('petrol_premium', 'Premium Petrol')
ON CONFLICT (code) DO NOTHING;

-- Step 3: Add fuel_type_id to fuel_prices
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
        ALTER TABLE public.fuel_prices
        ADD CONSTRAINT fk_fuel_prices_fuel_type
        FOREIGN KEY (fuel_type_id)
        REFERENCES public.fuel_types(id)
        ON DELETE RESTRICT;
        
        -- Create an index on the new foreign key column
        CREATE INDEX idx_fuel_prices_fuel_type_id ON public.fuel_prices(fuel_type_id);
        
        -- Update the existing index to include the new column instead of the old one
        DROP INDEX IF EXISTS idx_fuel_prices_type_date;
        CREATE INDEX idx_fuel_prices_type_date ON public.fuel_prices(fuel_type_id, effective_date DESC);
    END IF;
END $$;

-- Step 4: Add fuel_type_id to fuel_tanks
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
        
        -- Add foreign key constraint
        ALTER TABLE public.fuel_tanks
        ADD CONSTRAINT fk_fuel_tanks_fuel_type
        FOREIGN KEY (fuel_type_id)
        REFERENCES public.fuel_types(id)
        ON DELETE RESTRICT;
        
        -- Create an index on the new foreign key column
        CREATE INDEX idx_fuel_tanks_fuel_type_id ON public.fuel_tanks(fuel_type_id);
    END IF;
END $$;

-- Step 5: Update tanks with Regular/Premium in their name
DO $$
BEGIN
    -- Update Regular tanks
    UPDATE public.fuel_tanks
    SET fuel_type_id = (SELECT id FROM public.fuel_types WHERE code = 'petrol_regular')
    WHERE name ILIKE '%Regular%' AND fuel_type = 'petrol';

    -- Update Premium tanks
    UPDATE public.fuel_tanks
    SET fuel_type_id = (SELECT id FROM public.fuel_types WHERE code = 'petrol_premium')
    WHERE name ILIKE '%Premium%' AND fuel_type = 'petrol';
END $$;

-- Step 6: Drop and recreate the fuel_type constraint to be more permissive
ALTER TABLE public.fuel_tanks DROP CONSTRAINT IF EXISTS fuel_tanks_fuel_type_check;
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

-- Add final comment on tables
COMMENT ON TABLE public.fuel_types IS 'Stores available fuel types in the system, including variants';
COMMENT ON TABLE public.fuel_tanks IS 'Stores fuel tank information with foreign key to fuel_types';
COMMENT ON TABLE public.fuel_prices IS 'Stores fuel price history with foreign key to fuel_types';

-- Migration completed message
DO $$
BEGIN
    RAISE NOTICE 'Fuel type migration completed successfully';
END $$; 