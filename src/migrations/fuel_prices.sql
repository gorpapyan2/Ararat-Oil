-- Create fuel_prices table
CREATE TABLE IF NOT EXISTS public.fuel_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('diesel', 'gas', 'petrol_regular', 'petrol_premium')),
    price_per_liter NUMERIC(10, 2) NOT NULL CHECK (price_per_liter >= 0),
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index on fuel_type and effective_date for faster lookups
CREATE INDEX IF NOT EXISTS idx_fuel_prices_type_date ON public.fuel_prices(fuel_type, effective_date DESC);

-- Add a comment to the table
COMMENT ON TABLE public.fuel_prices IS 'Stores fuel prices for different fuel types with their effective dates';

-- Enable RLS but allow all operations for authenticated users
ALTER TABLE public.fuel_prices ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'fuel_prices' AND policyname = 'Allow authenticated users to select fuel prices'
    ) THEN
        CREATE POLICY "Allow authenticated users to select fuel prices" ON public.fuel_prices
            FOR SELECT USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'fuel_prices' AND policyname = 'Allow authenticated users to insert fuel prices'
    ) THEN
        CREATE POLICY "Allow authenticated users to insert fuel prices" ON public.fuel_prices
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
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

DROP TRIGGER IF EXISTS set_updated_at ON public.fuel_prices;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.fuel_prices
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at(); 