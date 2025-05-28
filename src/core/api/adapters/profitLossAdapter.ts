/**
 * Profit Loss Type Adapter
 *
 * This file provides adapter functions to convert between the core API ProfitLoss type
 * and the application's ProfitLossSummary and ProfitLossDetails types.
 */

import { ProfitLoss as ApiProfitLoss } from "@/core/api/types";
import { ProfitLossSummary } from "@/types";
import { ProfitLossDetails } from "@/services/profit-loss";

/**
 * Converts a core API ProfitLoss to the application ProfitLossSummary type
 */
export function adaptApiProfitLossToSummary(
  apiProfitLoss: ApiProfitLoss
): ProfitLossSummary {
  return {
    id: apiProfitLoss.id,
    period: apiProfitLoss.period,
    total_sales: apiProfitLoss.revenue, // API uses 'revenue', app uses 'total_sales'
    total_expenses: apiProfitLoss.expenses, // API uses 'expenses', app uses 'total_expenses'
    profit: apiProfitLoss.profit,
    created_at: apiProfitLoss.created_at,
    updated_at: apiProfitLoss.updated_at,
  };
}

/**
 * Converts an array of core API ProfitLoss to application ProfitLossSummary types
 * This function can handle both full ProfitLoss objects and summary objects (Omit<ProfitLoss, 'details'>)
 */
export function adaptApiProfitLossToSummaryArray(
  apiProfitLosses: (ApiProfitLoss | Omit<ApiProfitLoss, "details">)[]
): ProfitLossSummary[] {
  return apiProfitLosses.map((item) => ({
    id: item.id,
    period: item.period,
    total_sales: item.revenue, // API uses 'revenue', app uses 'total_sales'
    total_expenses: item.expenses, // API uses 'expenses', app uses 'total_expenses'
    profit: item.profit,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
}

/**
 * Converts a core API ProfitLoss to the application ProfitLossDetails type
 */
export function adaptApiProfitLossToDetails(
  apiProfitLoss: ApiProfitLoss
): ProfitLossDetails {
  // Create base ProfitLossDetails object
  const details: ProfitLossDetails = {
    period: apiProfitLoss.period,
    total_sales: apiProfitLoss.revenue,
    total_expenses: apiProfitLoss.expenses,
    profit: apiProfitLoss.profit,
    // Optional nested details can be added based on API response
  };

  return details;
}

/**
 * Converts the application ProfitLossSummary to a core API ProfitLoss type
 * (for use in create/update operations)
 */
export function adaptSummaryToApiProfitLoss(
  summary: ProfitLossSummary
): Omit<ApiProfitLoss, "id" | "created_at" | "updated_at"> {
  return {
    period: summary.period,
    revenue: summary.total_sales,
    expenses: summary.total_expenses,
    profit: summary.profit,
    notes: "", // Default empty notes
  };
}

/**
 * Converts the application ProfitLossDetails to a core API ProfitLoss type
 * (for use in create/update operations)
 */
export function adaptDetailsToApiProfitLoss(
  details: ProfitLossDetails
): Omit<ApiProfitLoss, "id" | "created_at" | "updated_at"> {
  return {
    period: details.period,
    revenue: details.total_sales,
    expenses: details.total_expenses,
    profit: details.profit,
    notes: "", // Default empty notes
  };
}
