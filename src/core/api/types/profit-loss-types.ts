/**
 * API ProfitLoss object type
 */
export interface ApiProfitLoss {
  id: string;
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  created_at: string;
  updated_at: string;
  notes?: string;
}
