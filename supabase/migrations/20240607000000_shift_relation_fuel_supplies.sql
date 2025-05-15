-- 1. Add shift_id column (nullable for now)
ALTER TABLE public.fuel_supplies ADD COLUMN IF NOT EXISTS shift_id uuid;

-- 2. (Optional) Migrate existing data if you have a way to map employee_id to shift_id
-- UPDATE public.fuel_supplies SET shift_id = (SELECT id FROM public.shifts WHERE employee_id = fuel_supplies.employee_id AND is_active = true LIMIT 1) WHERE shift_id IS NULL;

-- 3. Drop employee_id column if no longer needed
ALTER TABLE public.fuel_supplies DROP COLUMN IF EXISTS employee_id;

-- 4. Add foreign key constraint for shift_id
ALTER TABLE public.fuel_supplies
  ADD CONSTRAINT fuel_supplies_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.shifts(id) ON DELETE SET NULL;

-- 5. Create index for shift_id
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_shift_id ON public.fuel_supplies(shift_id); 