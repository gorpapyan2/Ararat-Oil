-- Create employees table if it doesn't exist (needed for foreign key)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT DEFAULT 'employee',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shifts table
CREATE TABLE IF NOT EXISTS public.shifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    opening_cash NUMERIC(10,2) NOT NULL DEFAULT 0,
    closing_cash NUMERIC(10,2),
    sales_total NUMERIC(10,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shifts_employee_id ON public.shifts(employee_id);
CREATE INDEX IF NOT EXISTS idx_shifts_status ON public.shifts(status);
CREATE INDEX IF NOT EXISTS idx_shifts_start_time ON public.shifts(start_time);

-- Create shift_payment_methods table for tracking different payment methods per shift
CREATE TABLE IF NOT EXISTS public.shift_payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shift_id UUID NOT NULL REFERENCES public.shifts(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'mobile_payment')),
    amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for shift_payment_methods
CREATE INDEX IF NOT EXISTS idx_shift_payment_methods_shift_id ON public.shift_payment_methods(shift_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_payment_methods ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shifts
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shifts' 
        AND policyname = 'Users can view all shifts'
    ) THEN
        CREATE POLICY "Users can view all shifts" ON public.shifts
            FOR SELECT USING (TRUE);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shifts' 
        AND policyname = 'Authenticated users can insert shifts'
    ) THEN
        CREATE POLICY "Authenticated users can insert shifts" ON public.shifts
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shifts' 
        AND policyname = 'Authenticated users can update shifts'
    ) THEN
        CREATE POLICY "Authenticated users can update shifts" ON public.shifts
            FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shifts' 
        AND policyname = 'Authenticated users can delete shifts'
    ) THEN
        CREATE POLICY "Authenticated users can delete shifts" ON public.shifts
            FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Create RLS policies for shift_payment_methods
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shift_payment_methods' 
        AND policyname = 'Users can view all shift payment methods'
    ) THEN
        CREATE POLICY "Users can view all shift payment methods" ON public.shift_payment_methods
            FOR SELECT USING (TRUE);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shift_payment_methods' 
        AND policyname = 'Authenticated users can insert shift payment methods'
    ) THEN
        CREATE POLICY "Authenticated users can insert shift payment methods" ON public.shift_payment_methods
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shift_payment_methods' 
        AND policyname = 'Authenticated users can update shift payment methods'
    ) THEN
        CREATE POLICY "Authenticated users can update shift payment methods" ON public.shift_payment_methods
            FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shift_payment_methods' 
        AND policyname = 'Authenticated users can delete shift payment methods'
    ) THEN
        CREATE POLICY "Authenticated users can delete shift payment methods" ON public.shift_payment_methods
            FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for shifts table (drop first if exists)
DROP TRIGGER IF EXISTS update_shifts_updated_at ON public.shifts;
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON public.shifts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a sample employee if none exist
INSERT INTO public.employees (id, name, email, role) 
SELECT 
    'development-user-id'::UUID, 
    'Development User', 
    'dev@example.com', 
    'admin'
WHERE NOT EXISTS (SELECT 1 FROM public.employees WHERE id = 'development-user-id'::UUID);

-- Insert some sample data for testing
INSERT INTO public.shifts (employee_id, opening_cash, sales_total, status) 
SELECT 
    'development-user-id'::UUID, 
    100.00, 
    0.00, 
    'OPEN'
WHERE NOT EXISTS (SELECT 1 FROM public.shifts WHERE employee_id = 'development-user-id'::UUID AND status = 'OPEN');

INSERT INTO public.shifts (employee_id, opening_cash, closing_cash, sales_total, status, start_time, end_time) 
VALUES 
    ('development-user-id'::UUID, 100.00, 150.00, 250.00, 'CLOSED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
    ('development-user-id'::UUID, 150.00, 200.00, 300.00, 'CLOSED', NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours')
ON CONFLICT DO NOTHING;
