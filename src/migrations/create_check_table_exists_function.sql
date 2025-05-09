-- Create a function to check if a table exists
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