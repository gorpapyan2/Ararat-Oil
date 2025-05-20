// Re-export the original service for backwards compatibility
export * from './dashboard';

// Import API endpoints
import { dashboardApi } from '@/core/api/endpoints/dashboard';
import { financialsApi } from '@/core/api/endpoints/financials';
import { tanksApi } from '@/core/api/endpoints/tanks';
import { salesApi } from '@/core/api/endpoints/sales';

// Import types
import type { DashboardData as ApiDashboardData } from '@/core/api/types';
import type { DashboardData } from '../types';

/**
 * Adapts API dashboard data to feature dashboard data
 */
function adaptApiDashboardData(apiData: ApiDashboardData): Partial<DashboardData> {
  return {
    // Map API data to feature data as needed
    // This is a partial mapping as the structure may differ
    sales: apiData.recent_sales || [],
    totalSales: apiData.revenue_summary?.monthly || 0,
    inventoryValue: apiData.inventory_status?.current_level || 0,
  };
}

/**
 * Get dashboard data from the API
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Make parallel requests to get all required data
    const [dashboardResponse, financialResponse, tanksResponse, salesResponse] = await Promise.all([
      dashboardApi.getData(),
      financialsApi.getFinanceOverview(),
      tanksApi.getTanks(),
      salesApi.getSales()
    ]);
    
    // Handle errors
    if (dashboardResponse.error) {
      throw new Error(dashboardResponse.error.message);
    }
    
    // Extract data
    const dashboardData = dashboardResponse.data;
    const financialData = financialResponse.data;
    const tanks = tanksResponse.data || [];
    const sales = salesResponse.data || [];
    
    // Calculate inventory value based on tank levels
    const inventoryValue = tanks.reduce((sum, tank) => {
      // You may want to get actual fuel prices here if available
      const defaultPricePerLiter = 500; // Example price in AMD
      return sum + (tank.current_level * defaultPricePerLiter);
    }, 0);
    
    return {
      sales: sales,
      expenses: [], // Would need to fetch from expenses API if needed
      tanks: tanks,
      totalSales: financialData?.total_sales || 0,
      totalExpenses: financialData?.total_expenses || 0,
      netProfit: financialData?.net_profit || 0,
      inventoryValue: inventoryValue
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return empty dashboard data structure in case of error
    return {
      sales: [],
      expenses: [],
      tanks: [],
      totalSales: 0,
      totalExpenses: 0,
      netProfit: 0,
      inventoryValue: 0
    };
  }
}

/**
 * Get real-time fuel levels
 */
export async function getFuelLevels(): Promise<Record<string, number>> {
  const response = await dashboardApi.getFuelLevels();
  
  if (response.error) {
    console.error('Error fetching fuel levels:', response.error);
    return {};
  }
  
  return response.data || {};
}

/**
 * Get sales summary by timeframe
 */
export async function getSalesSummary(timeframe: 'day' | 'week' | 'month' = 'day'): Promise<any> {
  const response = await dashboardApi.getSalesSummary(timeframe);
  
  if (response.error) {
    console.error('Error fetching sales summary:', response.error);
    return { data: [], total: 0, average: 0 };
  }
  
  return response.data || { data: [], total: 0, average: 0 };
}

/**
 * Get financial dashboard data
 */
export async function getFinancialDashboard(): Promise<any> {
  const response = await financialsApi.getDashboard();
  
  if (response.error) {
    console.error('Error fetching financial dashboard:', response.error);
    return {
      revenue: { total: 0, trend: [] },
      expenses: { total: 0, trend: [] },
      profit: { total: 0, trend: [] }
    };
  }
  
  return response.data || {
    revenue: { total: 0, trend: [] },
    expenses: { total: 0, trend: [] },
    profit: { total: 0, trend: [] }
  };
}

// Export dashboard service as an object for compatibility
export const dashboardService = {
  getDashboardData,
  getFuelLevels,
  getSalesSummary,
  getFinancialDashboard
}; 