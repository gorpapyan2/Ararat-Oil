
import { DashboardData, Sale } from "../types";
import { salesApi } from "@/core/api/endpoints/sales";
import { tanksApi } from "@/core/api/endpoints/tanks";
import { financialsApi } from "@/core/api/endpoints/financials";

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [salesResponse, tanksResponse, financialResponse] = await Promise.all([
      salesApi.getSales(),
      tanksApi.getTanks(),
      financialsApi.getFinanceOverview(),
    ]);

    const sales = salesResponse.data || [];
    const tanks = tanksResponse.data || [];
    const financialData = financialResponse.data;

    // Calculate inventory value
    const inventoryValue = tanks.reduce((sum, tank) => {
      const defaultPricePerLiter = 500; // Example price in AMD
      return sum + tank.current_level * defaultPricePerLiter;
    }, 0);

    // Calculate totals using correct property names
    const totalSales = financialData?.total_sales || 0;
    const totalExpenses = financialData?.total_expenses || 0;
    const netProfit = financialData?.net_profit || 0;
    // Use quantity_liters property from Sale type
    const totalLitersSold = sales.reduce((sum, sale) => sum + (sale.quantity_liters || 0), 0);

    return {
      sales,
      expenses: [],
      tanks,
      totalSales,
      totalExpenses,
      netProfit,
      inventoryValue,
      revenue: totalSales,
      revenuePercentChange: 12.5,
      fuelSold: totalLitersSold,
      fuelSoldPercentChange: 8.3,
      expensesPercentChange: -5.2,
      profit: netProfit,
      profitPercentChange: 15.7,
      totalRevenue: totalSales,
      revenueChange: 12.5,
      totalLitersSold,
      salesVolumeChange: 8.3,
      expensesChange: -5.2,
      efficiencyRatio: totalExpenses > 0 ? totalSales / totalExpenses : 0,
      efficiencyChange: 3.2,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    
    return {
      sales: [],
      expenses: [],
      tanks: [],
      totalSales: 0,
      totalExpenses: 0,
      netProfit: 0,
      inventoryValue: 0,
      revenue: 0,
      revenuePercentChange: 0,
      fuelSold: 0,
      fuelSoldPercentChange: 0,
      expensesPercentChange: 0,
      profit: 0,
      profitPercentChange: 0,
      totalRevenue: 0,
      revenueChange: 0,
      totalLitersSold: 0,
      salesVolumeChange: 0,
      expensesChange: 0,
      efficiencyRatio: 0,
      efficiencyChange: 0,
    };
  }
}

// Export as fetchDashboardData for backwards compatibility
export const fetchDashboardData = getDashboardData;
