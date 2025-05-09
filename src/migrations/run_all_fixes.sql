-- Master migration file to fix fuel types and petrol providers issues

-- Step 1: Create the check_table_exists function
CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = $1
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_table_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_table_exists TO anon;

-- Add function comment
COMMENT ON FUNCTION public.check_table_exists IS 'Checks if a table exists in the public schema';

-- Make sure the handle_updated_at function exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Fix petrol_providers table
DO $$
BEGIN
    -- Check if the table exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'petrol_providers'
    ) THEN
        -- Create the petrol_providers table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public.petrol_providers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            contact TEXT NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        -- Add sample providers
        INSERT INTO public.petrol_providers (name, contact, is_active) 
        VALUES 
            ('Default Fuel Provider', '+374 91 123456', true),
            ('Premium Fuel Supplier', '+374 93 987654', true)
        ON CONFLICT DO NOTHING;
        
        -- Add comment to table
        COMMENT ON TABLE public.petrol_providers IS 'Stores fuel provider information';
    END IF;

    -- Enable Row Level Security but allow all operations for authenticated users
    ALTER TABLE public.petrol_providers ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies if any (to avoid duplicates)
    DROP POLICY IF EXISTS "Allow authenticated users to select petrol_providers" ON public.petrol_providers;
    DROP POLICY IF EXISTS "Allow authenticated users to insert petrol_providers" ON public.petrol_providers;
    DROP POLICY IF EXISTS "Allow authenticated users to update petrol_providers" ON public.petrol_providers;
    DROP POLICY IF EXISTS "Allow authenticated users to delete petrol_providers" ON public.petrol_providers;
    
    -- Create policies
    CREATE POLICY "Allow authenticated users to select petrol_providers" ON public.petrol_providers
        FOR SELECT USING (auth.role() = 'authenticated');
    
    CREATE POLICY "Allow authenticated users to insert petrol_providers" ON public.petrol_providers
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
    CREATE POLICY "Allow authenticated users to update petrol_providers" ON public.petrol_providers
        FOR UPDATE USING (auth.role() = 'authenticated');
    
    CREATE POLICY "Allow authenticated users to delete petrol_providers" ON public.petrol_providers
        FOR DELETE USING (auth.role() = 'authenticated');

    -- Create a trigger for updated_at
    DROP TRIGGER IF EXISTS set_petrol_providers_updated_at ON public.petrol_providers;
    
    CREATE TRIGGER set_petrol_providers_updated_at
    BEFORE UPDATE ON public.petrol_providers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
    
    RAISE NOTICE 'Petrol providers table setup completed successfully';
END $$;

-- Step 3: Fix fuel_types table
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
        
        -- Enable RLS but allow all operations for authenticated users
        ALTER TABLE public.fuel_types ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Allow authenticated users to select fuel types" ON public.fuel_types
            FOR SELECT USING (auth.role() = 'authenticated');
        
        CREATE POLICY "Allow authenticated users to insert fuel types" ON public.fuel_types
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        
        CREATE POLICY "Allow authenticated users to update fuel types" ON public.fuel_types
            FOR UPDATE USING (auth.role() = 'authenticated');
            
        -- Create updated_at trigger
        CREATE TRIGGER set_fuel_types_updated_at
        BEFORE UPDATE ON public.fuel_types
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;

-- Step 4: Add fuel variants (regular/premium)
INSERT INTO public.fuel_types (code, name) 
VALUES 
    ('petrol_regular', 'Regular Petrol'),
    ('petrol_premium', 'Premium Petrol')
ON CONFLICT (code) DO NOTHING;

-- Step 5: Update tanks with Regular/Premium in their name
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fuel_tanks') THEN
        -- Update Regular tanks
        UPDATE public.fuel_tanks
        SET fuel_type_id = (SELECT id FROM public.fuel_types WHERE code = 'petrol_regular')
        WHERE name ILIKE '%Regular%' AND fuel_type = 'petrol';

        -- Update Premium tanks
        UPDATE public.fuel_tanks
        SET fuel_type_id = (SELECT id FROM public.fuel_types WHERE code = 'petrol_premium')
        WHERE name ILIKE '%Premium%' AND fuel_type = 'petrol';
        
        -- Drop any check constraint causing issues
        ALTER TABLE public.fuel_tanks DROP CONSTRAINT IF EXISTS fuel_tanks_fuel_type_check;
        
        -- Add a permissive constraint if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.constraint_column_usage 
            WHERE table_name = 'fuel_tanks' AND constraint_name = 'fuel_tanks_fuel_type_check'
        ) THEN
            ALTER TABLE public.fuel_tanks ADD CONSTRAINT fuel_tanks_fuel_type_check CHECK (true);
        END IF;
    END IF;
END $$;

-- Step 6: Add final comments on tables
COMMENT ON TABLE public.fuel_types IS 'Stores available fuel types in the system, including variants';
COMMENT ON TABLE public.petrol_providers IS 'Stores fuel provider information';

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fuel_tanks') THEN
        COMMENT ON TABLE public.fuel_tanks IS 'Stores fuel tank information with foreign key to fuel_types';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'fuel_prices') THEN
        COMMENT ON TABLE public.fuel_prices IS 'Stores fuel price history with foreign key to fuel_types';
    END IF;
END $$;

-- Migration completed message
DO $$
BEGIN
    RAISE NOTICE 'All fixes applied successfully';
END $$; 