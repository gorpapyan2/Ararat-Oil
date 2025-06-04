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
CREATE POLICY "Users can view all shifts" ON public.shifts
    FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can insert shifts" ON public.shifts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update shifts" ON public.shifts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete shifts" ON public.shifts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for shift_payment_methods
CREATE POLICY "Users can view all shift payment methods" ON public.shift_payment_methods
    FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can insert shift payment methods" ON public.shift_payment_methods
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update shift payment methods" ON public.shift_payment_methods
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete shift payment methods" ON public.shift_payment_methods
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for shifts table
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON public.shifts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); 