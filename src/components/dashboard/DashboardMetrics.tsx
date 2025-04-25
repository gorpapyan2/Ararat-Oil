import { TrendingUp, DollarSign, FuelIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSales } from "@/services/sales";
import { fetchExpenses } from "@/services/expenses";
import { fetchInventory } from "@/services/inventory";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function DashboardMetrics() {
  const { session } = useAuth();
  const { toast } = useToast();

  const { data: salesData, isLoading: isSalesLoading, error: salesError } = useQuery({
    queryKey: ['sales', session?.user?.id],
    queryFn: fetchSales,
    enabled: !!session?.user,
    retry: 1,
  });

  const { data: expensesData, isLoading: isExpensesLoading, error: expensesError } = useQuery({
    queryKey: ['expenses', session?.user?.id],
    queryFn: fetchExpenses,
    enabled: !!session?.user,
    retry: 1,
  });

  const { data: inventoryData, isLoading: isInventoryLoading, error: inventoryError } = useQuery({
    queryKey: ['inventory', session?.user?.id],
    queryFn: fetchInventory,
    enabled: !!session?.user,
    retry: 1,
  });

  useEffect(() => {
    if (salesError) {
      toast({
        title: "Error loading sales data",
        description: salesError.message,
        variant: "destructive",
      });
    }
    if (expensesError) {
      toast({
        title: "Error loading expenses data",
        description: expensesError.message,
        variant: "destructive",
      });
    }
    if (inventoryError) {
      toast({
        title: "Error loading inventory data",
        description: inventoryError.message,
        variant: "destructive",
      });
    }
  }, [salesError, expensesError, inventoryError, toast]);

  // Calculate totals with proper type checking
  const totalSales = salesData?.reduce((sum, sale) => 
    sum + Number(sale.total_sales || 0), 0) || 0;
  
  const totalExpenses = expensesData?.reduce((sum, expense) => 
    sum + Number(expense.amount || 0), 0) || 0;
  
  const netProfit = totalSales - totalExpenses;
  
  const inventoryValue = inventoryData?.reduce((sum, item) => 
    sum + (Number(item.quantity || 0) * Number(item.unit_price || 0)), 0) || 0;

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

  const renderLoadingState = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-6 w-28 bg-gray-200 rounded"></div>
      <div className="h-4 w-20 bg-gray-100 rounded"></div>
    </div>
  );

  const renderErrorState = (error: Error) => (
    <div className="text-red-500 text-sm">
      {error.message}
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
            renderLoadingState()
          ) : salesError ? (
            renderErrorState(salesError)
          ) : (
            <>
              {renderMetric(totalSales, 20.1)}
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isExpensesLoading ? (
            renderLoadingState()
          ) : expensesError ? (
            renderErrorState(expensesError)
          ) : (
            <>
              {renderMetric(totalExpenses, 19)}
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isSalesLoading || isExpensesLoading ? (
            renderLoadingState()
          ) : salesError || expensesError ? (
            renderErrorState(salesError || expensesError)
          ) : (
            <>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {netProfit.toLocaleString()} ֏
              </div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <FuelIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isInventoryLoading ? (
            renderLoadingState()
          ) : inventoryError ? (
            renderErrorState(inventoryError)
          ) : (
            <>
              {renderMetric(inventoryValue, 5)}
              <p className="text-xs text-muted-foreground">
                +5% since last week
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
