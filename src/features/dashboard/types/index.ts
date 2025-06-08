
import type { Sale, Expense, Tank } from '../../../core/api/types';

export interface DashboardData {
  sales: Sale[];
  expenses: Expense[];
  tanks: Tank[];
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  inventoryValue: number;
  
  // Additional calculated properties
  revenue: number;
  revenuePercentChange: number;
  fuelSold: number;
  fuelSoldPercentChange: number;
  expensesPercentChange: number;
  profit: number;
  profitPercentChange: number;
  
  // Metrics cards properties
  totalRevenue: number;
  revenueChange: number;
  totalLitersSold: number;
  salesVolumeChange: number;
  expensesChange: number;
  efficiencyRatio: number;
  efficiencyChange: number;
}

export interface SalesSummary {
  total_sales: number;
  totalVolume: number;
  averageSale: number;
  sales: Sale[];
}
