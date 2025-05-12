-- 1. Alter backup table to add action and actioned_at columns
ALTER TABLE public.fuel_prices_backup
ADD COLUMN IF NOT EXISTS action TEXT NOT NULL DEFAULT 'snapshot',
ADD COLUMN IF NOT EXISTS actioned_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 2. Add unique constraint to fuel_prices
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'fuel_prices' AND constraint_type = 'UNIQUE' AND constraint_name = 'unique_fuel_type_effective_date'
    ) THEN
        ALTER TABLE public.fuel_prices
        ADD CONSTRAINT unique_fuel_type_effective_date UNIQUE (fuel_type, effective_date);
    END IF;
END $$;

-- 3. Create trigger function to log changes
CREATE OR REPLACE FUNCTION public.log_fuel_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.fuel_prices_backup SELECT NEW.*, 'insert', NOW();
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.fuel_prices_backup SELECT NEW.*, 'update', NOW();
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.fuel_prices_backup SELECT OLD.*, 'delete', NOW();
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 4. Drop old triggers if they exist
DROP TRIGGER IF EXISTS fuel_prices_change_trigger ON public.fuel_prices;

-- 5. Create new trigger for all changes
CREATE TRIGGER fuel_prices_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.fuel_prices
FOR EACH ROW
EXECUTE FUNCTION public.log_fuel_price_change();

-- 6. Backfill: Insert all current data as a snapshot
INSERT INTO public.fuel_prices_backup
SELECT *, 'snapshot', NOW() FROM public.fuel_prices
ON CONFLICT DO NOTHING; 