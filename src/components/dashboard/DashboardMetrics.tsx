import { TrendingUp, DollarSign, Fuel, ArrowUp, ArrowDown, PieChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSales } from "@/services/sales";
import { fetchExpenses } from "@/services/expenses";
import { fetchInventory } from "@/services/inventory";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CardGrid, MetricCardProps } from "@/components/ui/card-grid";
import { Skeleton } from "@/components/ui/skeleton";

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

  const isLoading = isSalesLoading || isExpensesLoading || isInventoryLoading;
  const hasError = !!salesError || !!expensesError || !!inventoryError;

  const metrics = useMemo<MetricCardProps[]>(() => {
    if (isLoading) {
      // Return loading placeholders
      return Array(4).fill({
        title: "Loading...",
        value: <Skeleton className="h-8 w-32" />,
        description: <Skeleton className="h-4 w-24 mt-1" />,
        icon: PieChart
      });
    }

    if (hasError) {
      return [];
    }

    return [
      {
        title: "Total Sales",
        value: `${totalSales.toLocaleString()} ֏`,
        description: "+20.1% from last month",
        icon: DollarSign,
      },
      {
        title: "Total Expenses",
        value: `${totalExpenses.toLocaleString()} ֏`,
        description: "+19% from last month",
        icon: TrendingUp,
      },
      {
        title: "Net Profit",
        value: `${netProfit.toLocaleString()} ֏`,
        description: "+15% from last month",
        icon: netProfit >= 0 ? ArrowUp : ArrowDown,
        iconColor: netProfit >= 0 ? "text-green-500" : "text-red-500",
      },
      {
        title: "Inventory Value",
        value: `${inventoryValue.toLocaleString()} ֏`,
        description: "+5% since last week",
        icon: Fuel,
      }
    ];
  }, [isLoading, hasError, totalSales, totalExpenses, netProfit, inventoryValue]);

  if (hasError) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <h3 className="font-medium mb-1">Error loading dashboard data</h3>
        <p className="text-sm">
          {salesError?.message || expensesError?.message || inventoryError?.message || 
            "There was an error loading the dashboard metrics. Please try again later."}
        </p>
      </div>
    );
  }

  return <CardGrid metrics={metrics} />;
}
