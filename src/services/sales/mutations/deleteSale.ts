import { supabase } from "@/services/supabase";

type SaleWithFillingSystem = {
  id: string;
  total_sold_liters: number;
  filling_system_id: string;
  filling_system: {
    tank_id: string;
  };
};

export const deleteSale = async (id: string): Promise<void> => {
  const { data: saleData, error: saleError } = await supabase
    .from("sales")
    .select(`
      id,
      total_sold_liters,
      filling_system_id,
      filling_system:filling_systems(tank_id)
    `)
    .eq("id", id)
    .single();

  if (saleError) throw saleError;

  const typedSaleData = saleData as unknown as SaleWithFillingSystem;
  if (!typedSaleData?.filling_system?.tank_id) {
    throw new Error("Sale data or related tank information not found");
  }

  const tankId = typedSaleData.filling_system.tank_id;
  const soldLiters = typedSaleData.total_sold_liters || 0;

  const { data: tankData, error: tankError } = await supabase
    .from("fuel_tanks")
    .select("current_level")
    .eq("id", tankId)
    .single();

  if (tankError) throw tankError;

  const currentLevel = tankData.current_level;
  const newLevel = currentLevel + soldLiters;

  const { error: deleteError } = await supabase
    .from("sales")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;

  const { error: tankUpdateError } = await supabase
    .from("fuel_tanks")
    .update({ current_level: newLevel })
    .eq("id", tankId);

  if (tankUpdateError) throw tankUpdateError;

  const { error: levelChangeError } = await supabase
    .from("tank_level_changes")
    .insert({
      tank_id: tankId,
      change_amount: soldLiters,
      previous_level: currentLevel,
      new_level: newLevel,
      change_type: "add",
    });

  if (levelChangeError) throw levelChangeError;
};
