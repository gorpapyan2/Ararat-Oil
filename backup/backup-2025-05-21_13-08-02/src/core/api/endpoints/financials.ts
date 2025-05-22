import { fetchFromFunction, ApiResponse } from '../client';
import type { ProfitLoss, FinancialDashboard, RevenueData, ExpensesData } from '../types';
import { API_ENDPOINTS } from '@/core/config/api';

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.FINANCIALS;

/**
 * Get profit and loss data
 * @returns ApiResponse with profit and loss data
 */
export async function getFinancialProfitLoss(): Promise<ApiResponse<ProfitLoss[]>> {
  return fetchFromFunction<ProfitLoss[]>(`${ENDPOINT}/profit-loss`);
}

/**
 * Get revenue data with optional period filter
 * @param period Optional time period filter
 * @returns ApiResponse with revenue data
 */
export async function getFinancialRevenue(period?: string): Promise<ApiResponse<RevenueData>> {
  return fetchFromFunction<RevenueData>(`${ENDPOINT}/revenue`, { 
    queryParams: period ? { period } : undefined
  });
}

/**
 * Get expenses data with optional period filter
 * @param period Optional time period filter
 * @returns ApiResponse with expenses data
 */
export async function getFinancialExpenses(period?: string): Promise<ApiResponse<ExpensesData>> {
  return fetchFromFunction<ExpensesData>(`${ENDPOINT}/expenses`, { 
    queryParams: period ? { period } : undefined
  });
}

/**
 * Get financial dashboard data
 * @returns ApiResponse with financial dashboard data
 */
export async function getFinancialDashboard(): Promise<ApiResponse<FinancialDashboard>> {
  return fetchFromFunction<FinancialDashboard>(`${ENDPOINT}/dashboard`);
}

/**
 * Get finance overview data
 * @returns ApiResponse with finance overview data
 */
export async function getFinanceOverview(): Promise<ApiResponse<{
  total_sales: number;
  total_expenses: number;
  net_profit: number;
}>> {
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
  getProfitLoss: getFinancialProfitLoss,
  getRevenue: getFinancialRevenue,
  getExpenses: getFinancialExpenses,
  getDashboard: getFinancialDashboard,
  getFinanceOverview
}; 