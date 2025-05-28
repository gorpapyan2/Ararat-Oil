/**
 * Dashboard API
 *
 * This file provides API functions for accessing dashboard data.
 */

import { fetchFromFunction, ApiResponse } from "../client";
import { API_ENDPOINTS } from "@/core/config/api";
import type { DashboardData } from "../types";

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.DASHBOARD;

/**
 * Sales summary response structure
 */
export interface SalesSummary {
  total_sales: number;
  total_revenue: number;
  sales_by_fuel_type: Record<string, {
    quantity: number;
    revenue: number;
  }>;
  sales_by_payment_method: Record<string, {
    count: number;
    amount: number;
  }>;
  timeframe: "day" | "week" | "month";
  period_start: string;
  period_end: string;
}

/**
 * Fetches dashboard data
 */
export async function getDashboardData(): Promise<ApiResponse<DashboardData>> {
  return fetchFromFunction<DashboardData>(ENDPOINT);
}

/**
 * Fetches real-time fuel levels
 */
export async function getFuelLevels(): Promise<
  ApiResponse<Record<string, number>>
> {
  return fetchFromFunction<Record<string, number>>(`${ENDPOINT}/fuel-levels`);
}

/**
 * Fetches sales summary
 */
export async function getSalesSummary(
  timeframe: "day" | "week" | "month" = "day"
): Promise<ApiResponse<SalesSummary>> {
  return fetchFromFunction<SalesSummary>(`${ENDPOINT}/sales-summary`, {
    queryParams: { timeframe },
  });
}

/**
 * Dashboard API object with all methods
 */
export const dashboardApi = {
  getData: getDashboardData,
  getFuelLevels,
  getSalesSummary,
};
