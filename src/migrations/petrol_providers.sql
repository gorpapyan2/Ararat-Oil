-- Add is_active column to petrol_providers table
ALTER TABLE petrol_providers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing records to have is_active = true
UPDATE petrol_providers SET is_active = true WHERE is_active IS NULL; 