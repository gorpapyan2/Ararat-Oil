import { salesApi, expensesApi, tanksApi, Expense, Sale, FuelTank } from "@/core/api";
import type { DashboardData } from "../types";

export async function fetchDashboardData(): Promise<DashboardData> {
  const [sales, expenses, tanks] = await Promise.all([
    salesApi.getAll(),
    expensesApi.getAll(),
    tanksApi.getAll(),
  ]);

  // Calculate totals
  const totalSales = sales.data?.reduce((sum: number, sale: Sale) => sum + Number(sale.total_sales || 0), 0) || 0;
  const totalExpenses = expenses.data?.reduce((sum: number, expense: Expense) => sum + Number(expense.amount || 0), 0) || 0;
  const netProfit = totalSales - totalExpenses;

  // Calculate inventory value based on current tank levels
  const fuelPrices = {
    petrol: 500, // Example price per liter in AMD
    diesel: 550,
    gas: 300,
    kerosene: 600,
    cng: 350,
  };

  const inventoryValue = tanks.data?.reduce((sum: number, tank: FuelTank) => {
    const pricePerLiter = fuelPrices[tank.fuel_type as keyof typeof fuelPrices] || 500; // Default to petrol price if type unknown
    return sum + tank.current_level * pricePerLiter;
  }, 0);

  return {
    sales,
    expenses,
    tanks,
    totalSales,
    totalExpenses,
    netProfit,
    inventoryValue,
  };
} 