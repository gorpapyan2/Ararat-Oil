-- Fix migration for petrol_providers table
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

    -- Create a trigger for updated_at similar to other tables
    DROP TRIGGER IF EXISTS set_petrol_providers_updated_at ON public.petrol_providers;
    
    CREATE TRIGGER set_petrol_providers_updated_at
    BEFORE UPDATE ON public.petrol_providers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
    
    RAISE NOTICE 'Petrol providers table setup completed successfully';
END $$; 