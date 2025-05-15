-- Create a function to handle fuel supply updates with proper business logic
CREATE OR REPLACE FUNCTION update_fuel_supply(p_id uuid, p_supply jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_supply fuel_supplies;
  v_tank fuel_tanks;
  v_new_level numeric;
  v_total_cost numeric;
  v_quantity_change numeric;
BEGIN
  -- Get existing supply
  SELECT * INTO v_supply
  FROM fuel_supplies
  WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Fuel supply not found';
  END IF;

  -- Get current tank level and capacity
  SELECT * INTO v_tank
  FROM fuel_tanks
  WHERE id = v_supply.tank_id;

  -- Calculate quantity change if quantity is being updated
  IF p_supply->>'quantity_liters' IS NOT NULL THEN
    v_quantity_change := (p_supply->>'quantity_liters')::numeric - v_supply.quantity_liters;
    v_new_level := v_tank.current_level + v_quantity_change;

    -- Check if tank capacity would be exceeded
    IF v_new_level > v_tank.capacity THEN
      RAISE EXCEPTION 'Tank capacity would be exceeded. Current level: %, Capacity: %, Attempting to add: %',
        v_tank.current_level, v_tank.capacity, v_quantity_change;
    END IF;

    -- Check if new level would be negative
    IF v_new_level < 0 THEN
      RAISE EXCEPTION 'Tank level cannot be negative. Current level: %, Attempting to subtract: %',
        v_tank.current_level, ABS(v_quantity_change);
    END IF;
  END IF;

  -- Calculate total cost if price or quantity changed
  IF p_supply->>'price_per_liter' IS NOT NULL OR p_supply->>'quantity_liters' IS NOT NULL THEN
    v_total_cost := COALESCE(
      (p_supply->>'total_cost')::numeric,
      COALESCE((p_supply->>'quantity_liters')::numeric, v_supply.quantity_liters) *
      COALESCE((p_supply->>'price_per_liter')::numeric, v_supply.price_per_liter)
    );
  END IF;

  -- Start transaction
  BEGIN
    -- Update the fuel supply record
    UPDATE fuel_supplies
    SET
      delivery_date = COALESCE((p_supply->>'delivery_date')::timestamp, delivery_date),
      provider_id = COALESCE((p_supply->>'provider_id')::uuid, provider_id),
      tank_id = COALESCE((p_supply->>'tank_id')::uuid, tank_id),
      quantity_liters = COALESCE((p_supply->>'quantity_liters')::numeric, quantity_liters),
      price_per_liter = COALESCE((p_supply->>'price_per_liter')::numeric, price_per_liter),
      total_cost = COALESCE(v_total_cost, total_cost),
      employee_id = COALESCE((p_supply->>'employee_id')::uuid, employee_id),
      comments = COALESCE(p_supply->>'comments', comments),
      payment_method = COALESCE(p_supply->>'payment_method', payment_method),
      payment_status = COALESCE(p_supply->>'payment_status', payment_status)
    WHERE id = p_id
    RETURNING * INTO v_supply;

    -- Update tank level if quantity changed
    IF v_quantity_change IS NOT NULL THEN
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
        v_quantity_change,
        v_tank.current_level,
        v_new_level,
        CASE WHEN v_quantity_change > 0 THEN 'add' ELSE 'subtract' END
      );
    END IF;

    -- Update or create transaction record if payment details are provided
    IF p_supply->>'payment_method' IS NOT NULL OR p_supply->>'payment_status' IS NOT NULL THEN
      -- Delete existing transaction if any
      DELETE FROM transactions
      WHERE entity_id = p_id AND entity_type = 'fuel_supply';

      -- Create new transaction record
      INSERT INTO transactions (
        amount,
        payment_method,
        payment_status,
        employee_id,
        entity_id,
        entity_type,
        description
      )
      VALUES (
        v_supply.total_cost,
        COALESCE(p_supply->>'payment_method', v_supply.payment_method),
        COALESCE(p_supply->>'payment_status', v_supply.payment_status),
        v_supply.employee_id,
        v_supply.id,
        'fuel_supply',
        format('Fuel supply: %sL @ %s',
          v_supply.quantity_liters,
          v_supply.price_per_liter
        )
      );
    END IF;

    -- Return the updated supply with related data
    RETURN (
      SELECT jsonb_build_object(
        'data', jsonb_build_object(
          'id', v_supply.id,
          'delivery_date', v_supply.delivery_date,
          'provider_id', v_supply.provider_id,
          'tank_id', v_supply.tank_id,
          'quantity_liters', v_supply.quantity_liters,
          'price_per_liter', v_supply.price_per_liter,
          'total_cost', v_supply.total_cost,
          'employee_id', v_supply.employee_id,
          'comments', v_supply.comments,
          'payment_method', v_supply.payment_method,
          'payment_status', v_supply.payment_status,
          'created_at', v_supply.created_at,
          'provider', (
            SELECT jsonb_build_object(
              'id', p.id,
              'name', p.name,
              'contact', p.contact
            )
            FROM petrol_providers p
            WHERE p.id = v_supply.provider_id
          ),
          'tank', (
            SELECT jsonb_build_object(
              'id', t.id,
              'name', t.name,
              'fuel_type', t.fuel_type,
              'capacity', t.capacity,
              'current_level', t.current_level
            )
            FROM fuel_tanks t
            WHERE t.id = v_supply.tank_id
          ),
          'employee', (
            SELECT jsonb_build_object(
              'id', e.id,
              'name', e.name,
              'position', e.position
            )
            FROM employees e
            WHERE e.id = v_supply.employee_id
          )
        )
      )
    );
  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$; 