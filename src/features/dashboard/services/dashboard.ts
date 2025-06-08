
import {
  salesApi,
  expensesApi,
  tanksApi,
  Expense,
  Sale,
  Tank,
} from "@/core/api";
import type { DashboardData } from "../types";

/**
 * Fetches all dashboard data including sales, expenses, and tank information
 * @returns Promise<DashboardData> - Complete dashboard data
 */
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    // Fetch all required data in parallel
    const [salesResponse, expensesResponse, tanksResponse] = await Promise.all([
      salesApi.getSales(),
      expensesApi.getExpenses(),
      tanksApi.getTanks()
    ]);

    // Extract data from responses, defaulting to empty arrays if not present
    const sales: Sale[] = salesResponse.data || [];
    const expenses: Expense[] = expensesResponse.data || [];
    const tanks: Tank[] = tanksResponse.data || [];

    // Calculate basic totals using correct Sale properties
    const totalSales = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalSales - totalExpenses;

    // Calculate inventory value (using a default price per liter for now)
    const defaultPricePerLiter = 1.5; // This should come from fuel prices
    const inventoryValue = tanks.reduce((sum, tank) => {
      return sum + (tank.current_level * defaultPricePerLiter);
    }, 0);

    // Calculate additional derived properties using correct Sale properties
    const revenue = totalSales;
    const profit = netProfit;
    const fuelSold = sales.reduce((sum, sale) => sum + (sale.quantityLiters || 0), 0);
    const totalLitersSold = fuelSold;
    const totalRevenue = revenue;
    const efficiencyRatio = totalExpenses > 0 ? (totalRevenue / totalExpenses) : 0;

    // Mock percentage changes (in a real app, you'd compare with previous period)
    const revenuePercentChange = 12.5;
    const fuelSoldPercentChange = 8.3;
    const expensesPercentChange = -5.2;
    const profitPercentChange = 15.7;
    const revenueChange = revenuePercentChange;
    const salesVolumeChange = fuelSoldPercentChange;
    const expensesChange = expensesPercentChange;
    const efficiencyChange = 3.2;

    return {
      sales,
      expenses,
      tanks,
      totalSales,
      totalExpenses,
      netProfit,
      inventoryValue,
      revenue,
      revenuePercentChange,
      fuelSold,
      fuelSoldPercentChange,
      expensesPercentChange,
      profit,
      profitPercentChange,
      totalRevenue,
      revenueChange,
      totalLitersSold,
      salesVolumeChange,
      expensesChange,
      efficiencyRatio,
      efficiencyChange
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Export as getDashboardData for backward compatibility
export const getDashboardData = fetchDashboardData;

// Mock functions for other dashboard services
export const getFuelLevels = async (): Promise<Record<string, number>> => {
  try {
    const tanksResponse = await tanksApi.getTanks();
    const tanks = tanksResponse.data || [];
    
    return tanks.reduce((levels, tank) => {
      levels[tank.id] = (tank.current_level / tank.capacity) * 100;
      return levels;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error fetching fuel levels:', error);
    return {};
  }
};

export const getSalesSummary = async (timeframe: string = 'day') => {
  try {
    const salesResponse = await salesApi.getSales();
    const sales = salesResponse.data || [];
    
    const totalSales = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
    const totalVolume = sales.reduce((sum, sale) => sum + (sale.quantityLiters || 0), 0);
    const averageSale = sales.length > 0 ? totalSales / sales.length : 0;
    
    return {
      total_sales: totalSales,
      totalVolume,
      averageSale,
      sales
    };
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    return {
      total_sales: 0,
      totalVolume: 0,
      averageSale: 0,
      sales: []
    };
  }
};

export const getFinancialDashboard = async () => {
  try {
    return await fetchDashboardData();
  } catch (error) {
    console.error('Error fetching financial dashboard:', error);
    throw error;
  }
};
