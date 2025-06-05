-- Add support for multiple employees per shift
-- Create shift_employees junction table

CREATE TABLE IF NOT EXISTS public.shift_employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shift_id UUID NOT NULL REFERENCES public.shifts(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique combination of shift and employee
    UNIQUE(shift_id, employee_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shift_employees_shift_id ON public.shift_employees(shift_id);
CREATE INDEX IF NOT EXISTS idx_shift_employees_employee_id ON public.shift_employees(employee_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.shift_employees ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shift_employees
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shift_employees' 
        AND policyname = 'Users can view all shift employees'
    ) THEN
        CREATE POLICY "Users can view all shift employees" ON public.shift_employees
            FOR SELECT USING (TRUE);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shift_employees' 
        AND policyname = 'Authenticated users can insert shift employees'
    ) THEN
        CREATE POLICY "Authenticated users can insert shift employees" ON public.shift_employees
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shift_employees' 
        AND policyname = 'Authenticated users can update shift employees'
    ) THEN
        CREATE POLICY "Authenticated users can update shift employees" ON public.shift_employees
            FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'shift_employees' 
        AND policyname = 'Authenticated users can delete shift employees'
    ) THEN
        CREATE POLICY "Authenticated users can delete shift employees" ON public.shift_employees
            FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Migrate existing shifts data to new structure
-- For existing shifts that have employee_id, create corresponding shift_employees records
INSERT INTO public.shift_employees (shift_id, employee_id)
SELECT s.id, s.employee_id 
FROM public.shifts s 
WHERE s.employee_id IS NOT NULL
ON CONFLICT (shift_id, employee_id) DO NOTHING;

-- Note: We keep the employee_id column in shifts for backward compatibility
-- but new shifts will primarily use the shift_employees table

-- Add a function to get employees for a shift
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

-- Add a function to check if an employee has an open shift
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