/**
 * Profit Loss API
 *
 * This file provides API functions for accessing profit and loss data.
 */

import { fetchFromFunction, ApiResponse } from "../client";
import { API_ENDPOINTS } from "@/core/config/api";
import type { ProfitLoss } from "../types";

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.PROFIT_LOSS;

/**
 * Calculates profit and loss for a specific period
 */
export async function calculateProfitLoss(
  period: "day" | "week" | "month" | "quarter" | "year" | "custom",
  startDate?: string,
  endDate?: string,
  includeDetails?: boolean
): Promise<ApiResponse<ProfitLoss>> {
  return fetchFromFunction<ProfitLoss>(ENDPOINT, {
    queryParams: {
      period,
      start_date: startDate,
      end_date: endDate,
      include_details: includeDetails,
    },
  });
}

/**
 * Gets a profit loss summary
 */
export async function getProfitLossSummary(
  period: "day" | "week" | "month" | "quarter" | "year" | "custom",
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<Omit<ProfitLoss, "details">>> {
  return fetchFromFunction<Omit<ProfitLoss, "details">>(`${ENDPOINT}/summary`, {
    queryParams: {
      period,
      start_date: startDate,
      end_date: endDate,
    },
  });
}

/**
 * Fetches a profit loss report by ID
 */
export async function getProfitLossById(
  id: string
): Promise<ApiResponse<ProfitLoss>> {
  return fetchFromFunction<ProfitLoss>(`${ENDPOINT}/${id}`);
}

/**
 * Profit Loss API object with all methods
 */
export const profitLossApi = {
  calculateProfitLoss,
  getProfitLossSummary,
  getProfitLossById,
};
