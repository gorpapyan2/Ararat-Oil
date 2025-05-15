-- Drop existing foreign key constraints if they exist
ALTER TABLE fuel_supplies
  DROP CONSTRAINT IF EXISTS fuel_supplies_provider_id_fkey,
  DROP CONSTRAINT IF EXISTS fuel_supplies_tank_id_fkey,
  DROP CONSTRAINT IF EXISTS fuel_supplies_employee_id_fkey;

-- Add foreign key relationships for fuel_supplies table
ALTER TABLE fuel_supplies
  ADD CONSTRAINT fuel_supplies_provider_id_fkey
  FOREIGN KEY (provider_id)
  REFERENCES petrol_providers(id)
  ON DELETE RESTRICT;

ALTER TABLE fuel_supplies
  ADD CONSTRAINT fuel_supplies_tank_id_fkey
  FOREIGN KEY (tank_id)
  REFERENCES fuel_tanks(id)
  ON DELETE RESTRICT;

ALTER TABLE fuel_supplies
  ADD CONSTRAINT fuel_supplies_employee_id_fkey
  FOREIGN KEY (employee_id)
  REFERENCES employees(id)
  ON DELETE RESTRICT;

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_fuel_supplies_provider_id;
DROP INDEX IF EXISTS idx_fuel_supplies_tank_id;
DROP INDEX IF EXISTS idx_fuel_supplies_employee_id;
DROP INDEX IF EXISTS idx_fuel_supplies_delivery_date;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_provider_id ON fuel_supplies(provider_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_tank_id ON fuel_supplies(tank_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_employee_id ON fuel_supplies(employee_id);
CREATE INDEX IF NOT EXISTS idx_fuel_supplies_delivery_date ON fuel_supplies(delivery_date); 