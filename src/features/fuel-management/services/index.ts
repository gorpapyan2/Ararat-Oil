// Re-export the original service and adapters
export * from "./fuel-sales.service";
export * from "./adapters";
export * from "./filling-systems.service";

// Import types for additional functions
import { FuelSaleSummary } from '../types';
import {
  getFuelSales,
  fuelSalesService as originalService,
} from "./fuel-sales.service";

/**
 * Get fuel sales summary statistics
 */
export async function getFuelSalesSummary(dateRange?: {
  start: string;
  end: string;
}): Promise<FuelSaleSummary> {
  try {
    const filters = dateRange ? { date_range: dateRange } : undefined;
    const sales = await getFuelSales(filters);

    // Calculate summary statistics
    const totalSales = sales.reduce((sum, sale) => sum + sale.total_price, 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const averagePrice = totalQuantity > 0 ? totalSales / totalQuantity : 0;

    // Group sales by fuel type
    const salesByFuelType: Record<
      string,
      { quantity: number; amount: number }
    > = {};
    sales.forEach((sale) => {
      const fuelTypeId = sale.fuel_type_id;
      if (!salesByFuelType[fuelTypeId]) {
        salesByFuelType[fuelTypeId] = { quantity: 0, amount: 0 };
      }
      salesByFuelType[fuelTypeId].quantity += sale.quantity;
      salesByFuelType[fuelTypeId].amount += sale.total_price;
    });

    // Group sales by payment method
    const salesByPaymentMethod: Record<string, number> = {};
    sales.forEach((sale) => {
      const method = sale.payment_method;
      salesByPaymentMethod[method] =
        (salesByPaymentMethod[method] || 0) + sale.total_price;
    });

    // Group sales by date for daily breakdown
    const salesByDate = new Map<string, { amount: number; quantity: number }>();
    sales.forEach((sale) => {
      const date = sale.created_at.substring(0, 10); // YYYY-MM-DD
      if (!salesByDate.has(date)) {
        salesByDate.set(date, { amount: 0, quantity: 0 });
      }
      const dailyStats = salesByDate.get(date)!;
      dailyStats.amount += sale.total_price;
      dailyStats.quantity += sale.quantity;
    });

    // Convert to array format for the API response
    const dailySales = Array.from(salesByDate.entries()).map(
      ([date, stats]) => ({
        date,
        amount: stats.amount,
        quantity: stats.quantity,
      })
    );

    // Sort by date
    dailySales.sort((a, b) => a.date.localeCompare(b.date));

    return {
      total_sales: totalSales,
      total_quantity: totalQuantity,
      average_price: averagePrice,
      sales_by_fuel_type: salesByFuelType,
      sales_by_payment_method: salesByPaymentMethod,
      daily_sales: dailySales,
    };
  } catch (error) {
    console.error("Error calculating fuel sales summary:", error);
    return {
      total_sales: 0,
      total_quantity: 0,
      average_price: 0,
      sales_by_fuel_type: {},
      sales_by_payment_method: {},
      daily_sales: [],
    };
  }
}

// Update service object to include the new function
export const fuelSalesService = {
  ...originalService,
  getFuelSalesSummary,
};
