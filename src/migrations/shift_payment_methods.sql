-- Create the shift_payment_methods table
CREATE TABLE IF NOT EXISTS shift_payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add constraints
  CONSTRAINT shift_payment_methods_payment_method_check 
    CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'mobile_payment'))
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS shift_payment_methods_shift_id_idx ON shift_payment_methods(shift_id);
CREATE INDEX IF NOT EXISTS shift_payment_methods_payment_method_idx ON shift_payment_methods(payment_method);

-- Add comment to explain table purpose
COMMENT ON TABLE shift_payment_methods IS 'Stores payment methods used for each shift with corresponding amounts'; 