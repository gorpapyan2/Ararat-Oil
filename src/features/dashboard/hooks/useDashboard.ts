import { useQuery } from '@tanstack/react-query';
import { 
  getDashboardData, 
  getFuelLevels, 
  getSalesSummary,
  getFinancialDashboard
} from '../services';
import type { DashboardData } from '../types';

// Define query keys
const QUERY_KEYS = {
  dashboardData: 'dashboard-data',
  fuelLevels: 'fuel-levels',
  salesSummary: (timeframe: string) => ['sales-summary', timeframe],
  financialDashboard: 'financial-dashboard'
};

/**
 * Hook for fetching main dashboard data
 */
export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: [QUERY_KEYS.dashboardData],
    queryFn: getDashboardData,
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook for fetching real-time fuel levels
 */
export function useFuelLevels() {
  return useQuery<Record<string, number>>({
    queryKey: [QUERY_KEYS.fuelLevels],
    queryFn: getFuelLevels,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook for fetching sales summary by timeframe
 */
export function useSalesSummary(timeframe: 'day' | 'week' | 'month' = 'day') {
  return useQuery({
    queryKey: QUERY_KEYS.salesSummary(timeframe),
    queryFn: () => getSalesSummary(timeframe),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

/**
 * Hook for fetching financial dashboard data
 */
export function useFinancialDashboard() {
  return useQuery({
    queryKey: [QUERY_KEYS.financialDashboard],
    queryFn: getFinancialDashboard,
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

/**
 * Combined hook that returns all dashboard-related data
 */
export function useDashboard() {
  const dashboardData = useDashboardData();
  const fuelLevels = useFuelLevels();
  const dailySalesSummary = useSalesSummary('day');
  const financialDashboard = useFinancialDashboard();
  
  return {
    // Dashboard data
    data: dashboardData.data,
    isLoading: dashboardData.isLoading,
    error: dashboardData.error,
    
    // Fuel levels
    fuelLevels: fuelLevels.data || {},
    isLoadingFuelLevels: fuelLevels.isLoading,
    fuelLevelsError: fuelLevels.error,
    
    // Sales summary
    salesSummary: dailySalesSummary.data,
    isLoadingSalesSummary: dailySalesSummary.isLoading,
    salesSummaryError: dailySalesSummary.error,
    
    // Financial dashboard
    financialData: financialDashboard.data,
    isLoadingFinancialData: financialDashboard.isLoading,
    financialDataError: financialDashboard.error
  };
} 