import { fetchFromFunction, ApiResponse } from '../client';
import type { ProfitLoss, FinancialDashboard, RevenueData, ExpensesData } from '../types';

/**
 * Financials API functions for financial data
 */
export const financialsApi = {
  /**
   * Get profit and loss data
   * @returns ApiResponse with profit and loss data
   */
  getProfitLoss: (): Promise<ApiResponse<ProfitLoss[]>> => 
    fetchFromFunction('financials/profit-loss'),
  
  /**
   * Get revenue data with optional period filter
   * @param period Optional time period filter
   * @returns ApiResponse with revenue data
   */
  getRevenue: (period?: string): Promise<ApiResponse<RevenueData>> => 
    fetchFromFunction('financials/revenue', { 
      queryParams: period ? { period } : undefined
    }),
  
  /**
   * Get expenses data with optional period filter
   * @param period Optional time period filter
   * @returns ApiResponse with expenses data
   */
  getExpenses: (period?: string): Promise<ApiResponse<ExpensesData>> => 
    fetchFromFunction('financials/expenses', { 
      queryParams: period ? { period } : undefined
    }),
  
  /**
   * Get financial dashboard data
   * @returns ApiResponse with financial dashboard data
   */
  getDashboard: (): Promise<ApiResponse<FinancialDashboard>> => 
    fetchFromFunction('financials/dashboard'),
}; 