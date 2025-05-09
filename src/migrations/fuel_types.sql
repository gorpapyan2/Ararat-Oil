-- Create fuel_types table
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
    ('diesel', 'Diesel'),
    ('gas', 'Gas'),
    ('petrol_regular', 'Regular Petrol'),
    ('petrol_premium', 'Premium Petrol')
ON CONFLICT (code) DO NOTHING;

-- Create an index on code for faster lookups
CREATE INDEX IF NOT EXISTS idx_fuel_types_code ON public.fuel_types(code);

-- Add a comment to the table
COMMENT ON TABLE public.fuel_types IS 'Stores available fuel types in the system';

-- Enable RLS but allow all operations for authenticated users
ALTER TABLE public.fuel_types ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'fuel_types' AND policyname = 'Allow authenticated users to select fuel types'
    ) THEN
        CREATE POLICY "Allow authenticated users to select fuel types" ON public.fuel_types
            FOR SELECT USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'fuel_types' AND policyname = 'Allow authenticated users to insert fuel types'
    ) THEN
        CREATE POLICY "Allow authenticated users to insert fuel types" ON public.fuel_types
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'fuel_types' AND policyname = 'Allow authenticated users to update fuel types'
    ) THEN
        CREATE POLICY "Allow authenticated users to update fuel types" ON public.fuel_types
            FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_fuel_types_updated_at ON public.fuel_types;
CREATE TRIGGER set_fuel_types_updated_at
BEFORE UPDATE ON public.fuel_types
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at(); 