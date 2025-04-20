
import { supabase } from "@/integrations/supabase/client";
import { ProfitLoss } from "@/types";

export const fetchProfitLoss = async (): Promise<ProfitLoss[]> => {
  const { data, error } = await supabase
    .from('profit_loss_summary')
    .select('*')
    .order('period', { ascending: false });
    
  if (error) throw error;
  return data || [];
};
