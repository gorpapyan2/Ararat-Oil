import type { Sale, Expense, Tank } from '../../../core/api/types';

export interface DashboardData {
  sales: Sale[];
  expenses: Expense[];
  tanks: Tank[];
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  inventoryValue: number;
}
