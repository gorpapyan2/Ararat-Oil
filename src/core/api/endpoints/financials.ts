import { fetchFromFunction, ApiResponse } from "../client";
import type {
  ProfitLoss,
  FinancialDashboard,
  RevenueData,
  ExpensesData,
} from "../types";
import { API_ENDPOINTS } from "@/core/config/api";

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.FINANCIALS;

/**
 * Get profit and loss data
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @returns ApiResponse with profit and loss data
 */
export async function getProfitLoss(
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<ProfitLoss>> {
  const queryParams: Record<string, string> = {};
  if (startDate) queryParams.startDate = startDate;
  if (endDate) queryParams.endDate = endDate;
  
  return fetchFromFunction<ProfitLoss>(`${ENDPOINT}/profit-loss`, {
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  });
}

/**
 * Get revenue data with optional period filter
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @returns ApiResponse with revenue data
 */
export async function getRevenue(
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<RevenueData>> {
  const queryParams: Record<string, string> = {};
  if (startDate) queryParams.startDate = startDate;
  if (endDate) queryParams.endDate = endDate;
  
  return fetchFromFunction<RevenueData>(`${ENDPOINT}/revenue`, {
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  });
}

/**
 * Get expenses data with optional period filter
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @returns ApiResponse with expenses data
 */
export async function getExpenses(
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<ExpensesData>> {
  const queryParams: Record<string, string> = {};
  if (startDate) queryParams.startDate = startDate;
  if (endDate) queryParams.endDate = endDate;
  
  return fetchFromFunction<ExpensesData>(`${ENDPOINT}/expenses`, {
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  });
}

/**
 * Get financial dashboard data
 * @param startDate Optional start date filter
 * @param endDate Optional end date filter
 * @returns ApiResponse with financial dashboard data
 */
export async function getDashboard(
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<FinancialDashboard>> {
  const queryParams: Record<string, string> = {};
  if (startDate) queryParams.startDate = startDate;
  if (endDate) queryParams.endDate = endDate;
  
  return fetchFromFunction<FinancialDashboard>(`${ENDPOINT}/getDashboard`, {
    queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  });
}

/**
 * Get finance overview data
 * @returns ApiResponse with finance overview data
 */
export async function getFinanceOverview(): Promise<
  ApiResponse<{
    total_sales: number;
    total_expenses: number;
    net_profit: number;
  }>
> {
  return fetchFromFunction<{
    total_sales: number;
    total_expenses: number;
    net_profit: number;
  }>(`${ENDPOINT}/overview`);
}

/**
 * Financials API functions for financial data
 */
export const financialsApi = {
  getProfitLoss: getProfitLoss,
  getRevenue: getRevenue,
  getExpenses: getExpenses,
  getDashboard: getDashboard,
  getFinanceOverview,
};
