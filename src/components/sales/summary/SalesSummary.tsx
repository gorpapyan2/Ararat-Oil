import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sale } from "@/types";

interface SalesSummaryProps {
  sales: Sale[];
}

export function SalesSummary({ sales }: SalesSummaryProps) {
  // Calculate summary metrics
  const totalSales = sales.reduce((sum, sale) => sum + sale.total_sales, 0);
  const totalLiters = sales.reduce((sum, sale) => sum + sale.quantity, 0);

  // Calculate average price per unit
  const avgPricePerUnit = totalLiters > 0 ? totalSales / totalLiters : 0;

  // Calculate counts by fuel type
  const salesByFuelType = sales.reduce(
    (acc, sale) => {
      const fuelType = sale.fuel_type || "Unknown";
      if (!acc[fuelType]) {
        acc[fuelType] = 0;
      }
      acc[fuelType] += 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalSales.toLocaleString()} ֏
          </div>
          <p className="text-xs text-muted-foreground">
            {sales.length} sale records
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLiters.toFixed(2)} L</div>
          <p className="text-xs text-muted-foreground">
            Average: {(totalLiters / (sales.length || 1)).toFixed(2)} L per sale
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Price/Unit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {avgPricePerUnit.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}{" "}
            ֏
          </div>
          <p className="text-xs text-muted-foreground">
            Based on {sales.length} sales
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Sales by Fuel Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            {Object.entries(salesByFuelType).map(([fuelType, count]) => (
              <div key={fuelType} className="flex justify-between items-center">
                <span className="text-sm">{fuelType}</span>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
