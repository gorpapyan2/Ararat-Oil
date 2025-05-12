-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_filling_systems_tank_id ON public.filling_systems(tank_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_employee_id ON public.fuel_supplies(employee_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_provider_id ON public.fuel_supplies(provider_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_tank_id ON public.fuel_supplies(tank_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_employee_id ON public.sales(employee_id);
CREATE INDEX IF NOT EXISTS idx_sales_filling_system_id ON public.sales(filling_system_id);
CREATE INDEX IF NOT EXISTS idx_shifts_employee_id ON public.shifts(employee_id);
CREATE INDEX IF NOT EXISTS idx_fuel_tanks_fuel_type ON public.fuel_tanks(fuel_type_id);
CREATE INDEX IF NOT EXISTS idx_transactions_employee_id ON public.transactions(employee_id);

-- Add primary key to fuel_prices_backup
ALTER TABLE public.fuel_prices_backup
ADD COLUMN IF NOT EXISTS id BIGSERIAL PRIMARY KEY;

-- Remove unused indexes
DROP INDEX IF EXISTS public.transactions_employee_id_idx;
DROP INDEX IF EXISTS public.idx_fuel_prices_fuel_type_id;
DROP INDEX IF EXISTS public.idx_fuel_tanks_fuel_type_id;
DROP INDEX IF EXISTS public.idx_fuel_types_code;
DROP INDEX IF EXISTS public.idx_filling_systems_tank_id;
DROP INDEX IF EXISTS public.idx_fuel_supplies_employee_id;
DROP INDEX IF EXISTS public.idx_fuel_supplies_provider_id;
DROP INDEX IF EXISTS public.idx_fuel_supplies_tank_id;
DROP INDEX IF EXISTS public.idx_payment_methods_user_id;
DROP INDEX IF EXISTS public.idx_sales_employee_id;
DROP INDEX IF EXISTS public.idx_sales_filling_system_id;
DROP INDEX IF EXISTS public.idx_shifts_employee_id; 