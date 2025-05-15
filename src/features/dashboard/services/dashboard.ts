import { fetchSales } from "@/services/sales";
import { fetchExpenses } from "@/services/expenses";
import { fetchFuelTanks } from "@/services/tanks";
import type { DashboardData } from "../types";

export async function fetchDashboardData(): Promise<DashboardData> {
  const [sales, expenses, tanks] = await Promise.all([
    fetchSales(),
    fetchExpenses(),
    fetchFuelTanks(),
  ]);

  // Calculate totals
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total_sales || 0), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const netProfit = totalSales - totalExpenses;

  // Calculate inventory value based on current tank levels
  const fuelPrices = {
    petrol: 500, // Example price per liter in AMD
    diesel: 550,
    gas: 300,
    kerosene: 600,
    cng: 350,
  };

  const inventoryValue = tanks.reduce((sum, tank) => {
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