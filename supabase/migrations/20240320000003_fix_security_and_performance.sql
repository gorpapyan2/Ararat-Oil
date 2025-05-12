-- Fix function search paths
CREATE OR REPLACE FUNCTION public.log_fuel_price_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Existing function body
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Existing function body
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Add missing foreign key indexes
CREATE INDEX IF NOT EXISTS idx_filling_systems_tank_id ON public.filling_systems(tank_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_employee_id ON public.fuel_supplies(employee_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_provider_id ON public.fuel_supplies(provider_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_tank_id ON public.fuel_supplies(tank_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_employee_id ON public.sales(employee_id);
CREATE INDEX IF NOT EXISTS idx_sales_filling_system_id ON public.sales(filling_system_id);
CREATE INDEX IF NOT EXISTS idx_shifts_employee_id ON public.shifts(employee_id);

-- Remove unused indexes
DROP INDEX IF EXISTS public.idx_fuel_tanks_fuel_type;
DROP INDEX IF EXISTS public.idx_transactions_employee_id;

-- Add primary key to fuel_prices_backup if not already added
ALTER TABLE public.fuel_prices_backup
ADD COLUMN IF NOT EXISTS id BIGSERIAL PRIMARY KEY; 