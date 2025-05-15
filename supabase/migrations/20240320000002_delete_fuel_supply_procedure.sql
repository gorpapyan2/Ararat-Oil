-- Create a function to handle fuel supply deletion with proper business logic
CREATE OR REPLACE FUNCTION delete_fuel_supply(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_supply fuel_supplies;
  v_tank fuel_tanks;
  v_new_level numeric;
BEGIN
  -- Get the fuel supply to be deleted
  SELECT * INTO v_supply
  FROM fuel_supplies
  WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fuel supply not found';
  END IF;

  -- Get current tank level
  SELECT * INTO v_tank
  FROM fuel_tanks
  WHERE id = v_supply.tank_id;

  -- Calculate new tank level
  v_new_level := v_tank.current_level - v_supply.quantity_liters;

  -- Check if new level would be negative
  IF v_new_level < 0 THEN
    RAISE EXCEPTION 'Deleting this supply would result in negative tank level. Current level: %, Attempting to subtract: %',
      v_tank.current_level, v_supply.quantity_liters;
  END IF;

  -- Start transaction
  BEGIN
    -- Update tank level
    UPDATE fuel_tanks
    SET current_level = v_new_level
    WHERE id = v_tank.id;

    -- Record tank level change
    INSERT INTO tank_level_changes (
      tank_id,
      change_amount,
      previous_level,
      new_level,
      change_type
    )
    VALUES (
      v_tank.id,
      v_supply.quantity_liters,
      v_tank.current_level,
      v_new_level,
      'subtract'
    );

    -- Delete related transactions
    DELETE FROM transactions
    WHERE entity_id = p_id AND entity_type = 'fuel_supply';

    -- Delete the fuel supply
    DELETE FROM fuel_supplies
    WHERE id = p_id;

    -- Return success
    RETURN jsonb_build_object('success', true);
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$; 