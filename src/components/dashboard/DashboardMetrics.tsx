
import { TrendingUp, DollarSign, FuelIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSales } from "@/services/sales";
import { fetchExpenses } from "@/services/expenses";
import { fetchInventory } from "@/services/inventory";

export function DashboardMetrics() {
  const { data: salesData, isLoading: isSalesLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: fetchSales,
  });

  const { data: expensesData, isLoading: isExpensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });

  const { data: inventoryData, isLoading: isInventoryLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  // Calculate totals with proper type checking
  const totalSales = salesData?.reduce((sum, sale) => 
    sum + Number(sale.total_sales || 0), 0) || 0;
  
  const totalExpenses = expensesData?.reduce((sum, expense) => 
    sum + Number(expense.amount || 0), 0) || 0;
  
  const netProfit = totalSales - totalExpenses;
  
  const inventoryValue = inventoryData?.reduce((sum, item) => 
    sum + (Number(item.closing_stock || 0) * Number(item.unit_price || 0)), 0) || 0;

  const renderMetric = (value: number, growthRate: number) => (
    <div className="flex items-center space-x-2">
      <span className="text-2xl font-bold">{value.toLocaleString()} ֏</span>
      <span className={`flex items-center ${growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {growthRate >= 0 ? (
          <ArrowUpIcon className="h-4 w-4" />
        ) : (
          <ArrowDownIcon className="h-4 w-4" />
        )}
        <span className="text-xs">{Math.abs(growthRate)}%</span>
      </span>
    </div>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isSalesLoading ? (
            <div>Loading...</div>
          ) : (
            renderMetric(totalSales, 20.1)
          )}
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isExpensesLoading ? (
            <div>Loading...</div>
          ) : (
            renderMetric(totalExpenses, 19)
          )}
          <p className="text-xs text-muted-foreground">
            +19% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isSalesLoading || isExpensesLoading ? (
            <div>Loading...</div>
          ) : (
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {netProfit.toLocaleString()} ֏
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            +15% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <FuelIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isInventoryLoading ? (
            <div>Loading...</div>
          ) : (
            renderMetric(inventoryValue, 5)
          )}
          <p className="text-xs text-muted-foreground">
            +5% since last week
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
