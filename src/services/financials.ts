import { supabase } from "@/integrations/supabase/client";
import { ProfitLoss } from "@/types";

export const fetchProfitLoss = async (): Promise<ProfitLoss[]> => {
  try {
    const { data, error } = await supabase
      .from("profit_loss_summary")
      .select("*")
      .order("period", { ascending: false });

    if (error) {
      console.error("Error fetching profit/loss summary:", error);
      throw new Error(error.message);
    }
    return data || [];
  } catch (err: any) {
    console.error("Failed to fetch profit/loss summary:", err);
    throw new Error(err.message || "Failed to fetch financial data");
  }
};
