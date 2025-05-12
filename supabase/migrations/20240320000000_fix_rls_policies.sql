-- Fix RLS policies for fuel_prices table
ALTER POLICY "Allow authenticated users to select fuel prices" ON public.fuel_prices
    USING ((select auth.role()) = 'authenticated');

ALTER POLICY "Allow authenticated users to insert fuel prices" ON public.fuel_prices
    WITH CHECK ((select auth.role()) = 'authenticated');

-- Fix RLS policies for fuel_types table
ALTER POLICY "Allow authenticated users to select fuel types" ON public.fuel_types
    USING ((select auth.role()) = 'authenticated');

ALTER POLICY "Allow authenticated users to insert fuel types" ON public.fuel_types
    WITH CHECK ((select auth.role()) = 'authenticated');

ALTER POLICY "Allow authenticated users to update fuel types" ON public.fuel_types
    USING ((select auth.role()) = 'authenticated');

-- Fix RLS policies for petrol_providers table
ALTER POLICY "Allow authenticated users to select petrol_providers" ON public.petrol_providers
    USING ((select auth.role()) = 'authenticated');

ALTER POLICY "Allow authenticated users to insert petrol_providers" ON public.petrol_providers
    WITH CHECK ((select auth.role()) = 'authenticated');

ALTER POLICY "Allow authenticated users to update petrol_providers" ON public.petrol_providers
    USING ((select auth.role()) = 'authenticated');

ALTER POLICY "Allow authenticated users to delete petrol_providers" ON public.petrol_providers
    USING ((select auth.role()) = 'authenticated');

-- Fix RLS policies for fuel_prices_backup table
ALTER POLICY "Allow authenticated users to select fuel prices backup" ON public.fuel_prices_backup
    USING ((select auth.role()) = 'authenticated'); 