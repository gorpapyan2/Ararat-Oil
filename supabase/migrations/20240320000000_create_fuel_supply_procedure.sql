-- Create a function to handle fuel supply creation with proper business logic
CREATE OR REPLACE FUNCTION create_fuel_supply(p_supply jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_supply fuel_supplies;
  v_tank fuel_tanks;
  v_new_level numeric;
  v_total_cost numeric;
BEGIN
  -- Calculate total cost if not provided
  v_total_cost := COALESCE(
    (p_supply->>'total_cost')::numeric,
    (p_supply->>'quantity_liters')::numeric * (p_supply->>'price_per_liter')::numeric
  );

  -- Get current tank level and capacity
  SELECT * INTO v_tank
  FROM fuel_tanks
  WHERE id = (p_supply->>'tank_id')::uuid;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tank not found';
  END IF;

  -- Calculate new tank level
  v_new_level := v_tank.current_level + (p_supply->>'quantity_liters')::numeric;

  -- Check if tank capacity would be exceeded
  IF v_new_level > v_tank.capacity THEN
    RAISE EXCEPTION 'Tank capacity would be exceeded. Current level: %, Capacity: %, Attempting to add: %',
      v_tank.current_level, v_tank.capacity, (p_supply->>'quantity_liters')::numeric;
  END IF;

  -- Start transaction
  BEGIN
    -- Insert the fuel supply record
    INSERT INTO fuel_supplies (
      delivery_date,
      provider_id,
      tank_id,
      quantity_liters,
      price_per_liter,
      total_cost,
      employee_id,
      comments,
      payment_method,
      payment_status
    )
    VALUES (
      (p_supply->>'delivery_date')::timestamp,
      (p_supply->>'provider_id')::uuid,
      (p_supply->>'tank_id')::uuid,
      (p_supply->>'quantity_liters')::numeric,
      (p_supply->>'price_per_liter')::numeric,
      v_total_cost,
      (p_supply->>'employee_id')::uuid,
      p_supply->>'comments',
      p_supply->>'payment_method',
      p_supply->>'payment_status'
    )
    RETURNING * INTO v_supply;

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
      (p_supply->>'quantity_liters')::numeric,
      v_tank.current_level,
      v_new_level,
      'add'
    );

    -- Create transaction record if payment details are provided
    IF p_supply->>'payment_method' IS NOT NULL AND p_supply->>'payment_status' IS NOT NULL THEN
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
        v_total_cost,
        p_supply->>'payment_method',
        p_supply->>'payment_status',
        (p_supply->>'employee_id')::uuid,
        v_supply.id,
        'fuel_supply',
        format('Fuel supply: %sL @ %s',
          (p_supply->>'quantity_liters')::numeric,
          (p_supply->>'price_per_liter')::numeric
        )
      );
    END IF;

    -- Return the created supply with related data
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