-- Drop ALL existing policies for petrol_providers table
DROP POLICY IF EXISTS "Enable delete for all users" ON public.petrol_providers;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.petrol_providers;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.petrol_providers;
DROP POLICY IF EXISTS "Enable update for all users" ON public.petrol_providers;
DROP POLICY IF EXISTS "Allow authenticated users to select petrol_providers" ON public.petrol_providers;
DROP POLICY IF EXISTS "Allow authenticated users to insert petrol_providers" ON public.petrol_providers;
DROP POLICY IF EXISTS "Allow authenticated users to update petrol_providers" ON public.petrol_providers;
DROP POLICY IF EXISTS "Allow authenticated users to delete petrol_providers" ON public.petrol_providers;
DROP POLICY IF EXISTS "petrol_providers_select_policy" ON public.petrol_providers;
DROP POLICY IF EXISTS "petrol_providers_insert_policy" ON public.petrol_providers;
DROP POLICY IF EXISTS "petrol_providers_update_policy" ON public.petrol_providers;
DROP POLICY IF EXISTS "petrol_providers_delete_policy" ON public.petrol_providers;

-- Create consolidated policies for authenticated users
CREATE POLICY "petrol_providers_select_policy" ON public.petrol_providers
    FOR SELECT
    TO authenticated
    USING ((select auth.role()) = 'authenticated');

CREATE POLICY "petrol_providers_insert_policy" ON public.petrol_providers
    FOR INSERT
    TO authenticated
    WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "petrol_providers_update_policy" ON public.petrol_providers
    FOR UPDATE
    TO authenticated
    USING ((select auth.role()) = 'authenticated')
    WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "petrol_providers_delete_policy" ON public.petrol_providers
    FOR DELETE
    TO authenticated
    USING ((select auth.role()) = 'authenticated'); 