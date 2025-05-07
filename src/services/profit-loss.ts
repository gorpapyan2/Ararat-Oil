import { supabase } from "@/services/supabase";
import { ProfitLossSummary } from "@/types";

export async function fetchProfitLossSummary(): Promise<ProfitLossSummary[]> {
  const { data, error } = await supabase
    .from("profit_loss_summary")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as ProfitLossSummary[];
} 