import {
  TrendingUp,
  DollarSign,
  Fuel,
  ArrowUp,
  ArrowDown,
  PieChart,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSales } from "@/services/sales";
import { fetchExpenses } from "@/services/expenses";
import { fetchFuelTanks } from "@/services/tanks";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo } from "react";
import { useToast } from "@/hooks";
import { CardGrid, MetricCardProps } from "@/components/ui/composed/cards";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export function DashboardMetrics() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { toast } = useToast();

  const {
    data: salesData,
    isLoading: isSalesLoading,
    error: salesError,
  } = useQuery({
    queryKey: ["sales", session?.user?.id],
    queryFn: fetchSales,
    enabled: !!session?.user,
    retry: 1,
  });

  const {
    data: expensesData,
    isLoading: isExpensesLoading,
    error: expensesError,
  } = useQuery({
    queryKey: ["expenses", session?.user?.id],
    queryFn: fetchExpenses,
    enabled: !!session?.user,
    retry: 1,
  });

  const {
    data: tanksData,
    isLoading: isTanksLoading,
    error: tanksError,
  } = useQuery({
    queryKey: ["fuel-tanks", session?.user?.id],
    queryFn: fetchFuelTanks,
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
    if (tanksError) {
      toast({
        title: "Error loading tanks data",
        description: tanksError.message,
        variant: "destructive",
      });
    }
  }, [salesError, expensesError, tanksError, toast]);

  // Calculate totals with proper type checking
  const totalSales =
    salesData?.reduce((sum, sale) => sum + Number(sale.total_sales || 0), 0) ||
    0;

  const totalExpenses =
    expensesData?.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0,
    ) || 0;

  const netProfit = totalSales - totalExpenses;

  // Calculate inventory value based on current tank levels
  // Using average fuel prices (could be refined with actual current prices)
  const fuelPrices = {
    petrol: 500, // Example price per liter in AMD
    diesel: 550,
    gas: 300,
    kerosene: 600,
    cng: 350,
  };

  const inventoryValue =
    tanksData?.reduce((sum, tank) => {
      const pricePerLiter = fuelPrices[tank.fuel_type] || 500; // Default to petrol price if type unknown
      return sum + tank.current_level * pricePerLiter;
    }, 0) || 0;

  const isLoading = isSalesLoading || isExpensesLoading || isTanksLoading;
  const hasError = !!salesError || !!expensesError || !!tanksError;

  const metrics = useMemo<MetricCardProps[]>(() => {
    if (isLoading) {
      // Return loading placeholders
      return Array(4).fill({
        title: t("common.loading"),
        value: "Loading...",
        description: t("common.loading"),
        icon: PieChart,
        loading: true,
      });
    }

    if (hasError) {
      return [];
    }

    return [
      {
        title: t("dashboard.totalSales"),
        value: `${totalSales.toLocaleString()} ֏`,
        description: "+20.1% from last month",
        icon: DollarSign,
      },
      {
        title: t("dashboard.totalExpenses"),
        value: `${totalExpenses.toLocaleString()} ֏`,
        description: "+19% from last month",
        icon: TrendingUp,
      },
      {
        title: t("dashboard.netProfit"),
        value: `${netProfit.toLocaleString()} ֏`,
        description: "+15% from last month",
        icon: netProfit >= 0 ? ArrowUp : ArrowDown,
        iconColor: netProfit >= 0 ? "text-green-500" : "text-red-500",
      },
      {
        title: t("dashboard.inventoryValue"),
        value: `${inventoryValue.toLocaleString()} ֏`,
        description: "Based on current tank levels",
        icon: Fuel,
      },
    ];
  }, [
    isLoading,
    hasError,
    totalSales,
    totalExpenses,
    netProfit,
    inventoryValue,
    t,
  ]);

  if (hasError) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <h3 className="font-medium mb-1">Error loading dashboard data</h3>
        <p className="text-sm">
          {salesError?.message ||
            expensesError?.message ||
            tanksError?.message ||
            "There was an error loading the dashboard metrics. Please try again later."}
        </p>
      </div>
    );
  }

  return <CardGrid metrics={metrics} />;
}
