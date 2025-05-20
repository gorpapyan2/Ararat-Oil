import type { Sale } from "@/types/sales";
import type { Expense } from "@/types/expenses";
import type { FuelTank } from "@/types/fuel";

export interface DashboardData {
  sales: Sale[];
  expenses: Expense[];
  tanks: FuelTank[];
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  inventoryValue: number;
} 