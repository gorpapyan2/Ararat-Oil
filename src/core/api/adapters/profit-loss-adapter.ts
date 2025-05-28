import { ApiProfitLoss } from "../types/profit-loss-types";
import { ProfitLossSummary } from "@/types";

/**
 * Converts API profit-loss data format to the application's profit-loss summary format
 */
function fromApiData(data: ApiProfitLoss): ProfitLossSummary;
function fromApiData(data: ApiProfitLoss[]): ProfitLossSummary[];
function fromApiData(
  data: ApiProfitLoss | ApiProfitLoss[]
): ProfitLossSummary | ProfitLossSummary[] {
  if (Array.isArray(data)) {
    return data.map((item) => fromApiData(item));
  }

  return {
    id: data.id,
    period: data.period,
    total_sales: data.revenue,
    total_expenses: data.expenses,
    profit: data.profit,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/**
 * Converts application's profit-loss summary format to the API profit-loss data format
 */
function toApiData(data: ProfitLossSummary): ApiProfitLoss;
function toApiData(data: ProfitLossSummary[]): ApiProfitLoss[];
function toApiData(
  data: ProfitLossSummary | ProfitLossSummary[]
): ApiProfitLoss | ApiProfitLoss[] {
  if (Array.isArray(data)) {
    return data.map((item) => toApiData(item));
  }

  return {
    id: data.id,
    period: data.period,
    revenue: data.total_sales,
    expenses: data.total_expenses,
    profit: data.profit,
    created_at: data.created_at,
    updated_at: data.updated_at,
    notes: "",
  };
}

export const profitLossAdapter = {
  fromApiData,
  toApiData,
};

// Export old function names for backward compatibility
export const adaptApiProfitLossToSummary = fromApiData;
export const adaptSummaryToApiProfitLoss = toApiData;
