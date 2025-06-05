-- Simple migration to add shift_employees table for multiple employees per shift

-- Create shift_employees junction table
CREATE TABLE IF NOT EXISTS public.shift_employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shift_id UUID NOT NULL REFERENCES public.shifts(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(shift_id, employee_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shift_employees_shift_id ON public.shift_employees(shift_id);
CREATE INDEX IF NOT EXISTS idx_shift_employees_employee_id ON public.shift_employees(employee_id);

-- Enable RLS
ALTER TABLE public.shift_employees ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies
CREATE POLICY "Enable read access for all users" ON public.shift_employees FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.shift_employees FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.shift_employees FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON public.shift_employees FOR DELETE USING (auth.role() = 'authenticated');

-- Function to get employees for a shift
CREATE OR REPLACE FUNCTION public.get_shift_employees(shift_id_param UUID)
RETURNS TABLE (
    employee_id UUID,
    employee_name TEXT,
    employee_position TEXT,
    employee_status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as employee_id,
        e.name as employee_name,
        COALESCE(e.position, 'Unknown') as employee_position,
        COALESCE(e.status, 'active') as employee_status
    FROM public.shift_employees se
    JOIN public.employees e ON se.employee_id = e.id
    WHERE se.shift_id = shift_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to check if employee has open shift
CREATE OR REPLACE FUNCTION public.employee_has_open_shift(employee_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.shifts s
        JOIN public.shift_employees se ON s.id = se.shift_id
        WHERE se.employee_id = employee_id_param 
        AND s.status = 'OPEN'
    );
END;
$$ LANGUAGE plpgsql; 