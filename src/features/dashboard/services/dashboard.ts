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

    // Calculate totals
    const totalSales = sales.reduce((sum, sale) => sum + (sale.total_price || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalSales - totalExpenses;

    // Calculate inventory value (using a default price per liter for now)
    const defaultPricePerLiter = 1.5; // This should come from fuel prices
    const inventoryValue = tanks.reduce((sum, tank) => {
      return sum + (tank.current_level * defaultPricePerLiter);
    }, 0);

    return {
      sales,
      expenses,
      tanks,
      totalSales,
      totalExpenses,
      netProfit,
      inventoryValue
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
