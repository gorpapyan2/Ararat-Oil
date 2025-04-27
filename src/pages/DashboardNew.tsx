import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  DollarSign,
  Fuel,
  BarChart4,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  CalendarRange,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import our custom UI components
import {
  MetricCard,
  ActionCard,
  SummaryCard,
} from "@/components/ui-custom/data-card";
import { PageHeader, CreateButton } from "@/components/ui-custom/page-header";

// Import services
import { fetchSales } from "@/services/sales";
import { fetchExpenses } from "@/services/expenses";
import { fetchFuelTanks } from "@/services/tanks";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui-custom/card";

export default function Dashboard() {
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch sales data
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

  // Fetch expenses data
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

  // Fetch fuel tanks data
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

  // Show errors in toast notifications
  React.useEffect(() => {
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

  // Calculate metrics
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
  const fuelPrices = {
    petrol: 500, // Example price per liter in AMD
    diesel: 550,
    gas: 300,
    kerosene: 600,
    cng: 350,
  };

  const inventoryValue =
    tanksData?.reduce((sum, tank) => {
      const pricePerLiter = fuelPrices[tank.fuel_type] || 500;
      return sum + tank.current_level * pricePerLiter;
    }, 0) || 0;

  const isLoading = isSalesLoading || isExpensesLoading || isTanksLoading;
  const hasError = !!salesError || !!expensesError || !!tanksError;

  // Mock data for trends (in a real app, this would come from the API)
  const mockTrends = {
    sales: { value: "20.1%", positive: true },
    expenses: { value: "12.5%", positive: false },
    profit: { value: "15.3%", positive: true },
    inventory: { value: "5.2%", positive: true },
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} ֏`;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your business performance"
        actions={
          <Button variant="outline" size="sm">
            <CalendarRange className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
        }
      />

      {/* KPI Metrics Grid */}
      <section aria-label="Key Performance Indicators">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Sales Metric */}
          <MetricCard
            title="Total Sales"
            value={isLoading ? "Loading..." : formatCurrency(totalSales)}
            icon={<DollarSign className="h-5 w-5" />}
            trend={
              !isLoading
                ? {
                    value: mockTrends.sales.value,
                    positive: mockTrends.sales.positive,
                    label: "vs last month",
                  }
                : undefined
            }
            loading={isLoading}
            onClick={() => navigate("/sales")}
          />

          {/* Expenses Metric */}
          <MetricCard
            title="Total Expenses"
            value={isLoading ? "Loading..." : formatCurrency(totalExpenses)}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={
              !isLoading
                ? {
                    value: mockTrends.expenses.value,
                    positive: mockTrends.expenses.positive,
                    label: "vs last month",
                  }
                : undefined
            }
            loading={isLoading}
            onClick={() => navigate("/expenses")}
          />

          {/* Net Profit Metric */}
          <MetricCard
            title="Net Profit"
            value={isLoading ? "Loading..." : formatCurrency(netProfit)}
            icon={
              netProfit >= 0 ? (
                <ArrowUpRight className="h-5 w-5" />
              ) : (
                <ArrowDownRight className="h-5 w-5" />
              )
            }
            trend={
              !isLoading
                ? {
                    value: mockTrends.profit.value,
                    positive: mockTrends.profit.positive,
                    label: "vs last month",
                  }
                : undefined
            }
            loading={isLoading}
            className={netProfit < 0 ? "border-red-200" : ""}
          />

          {/* Inventory Value Metric */}
          <MetricCard
            title="Inventory Value"
            value={isLoading ? "Loading..." : formatCurrency(inventoryValue)}
            icon={<Fuel className="h-5 w-5" />}
            trend={
              !isLoading
                ? {
                    value: mockTrends.inventory.value,
                    positive: mockTrends.inventory.positive,
                    label: "vs last month",
                  }
                : undefined
            }
            loading={isLoading}
            onClick={() => navigate("/fuel-management?tab=tanks")}
          />
        </div>
      </section>

      {/* Charts and Additional Info */}
      <section aria-label="Charts and Additional Information">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {/* Main Chart - Takes up 2/3 of the space on large screens */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle size="md">Revenue & Expenses Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart4 className="mx-auto h-16 w-16 mb-4 opacity-50" />
                <p>Chart visualization will be implemented here</p>
                <p className="text-sm mt-2">
                  Showing data for the last 6 months
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right sidebar with additional cards */}
          <div className="space-y-4">
            {/* Staff Activity Card */}
            <ActionCard
              title="Staff Performance"
              description="3 employees exceeded their sales targets this month"
              status="success"
              icon={<Users className="h-5 w-5" />}
              actionLabel="View employee details"
              onAction={() => navigate("/employees")}
            />

            {/* Fuel Levels Summary */}
            <SummaryCard
              title="Fuel Inventory Status"
              metrics={[
                { label: "Petrol", value: "85%", color: "success" },
                { label: "Diesel", value: "62%", color: "default" },
                { label: "CNG", value: "28%", color: "warning" },
                { label: "Kerosene", value: "91%", color: "success" },
              ]}
              action={{
                label: "View all tanks",
                onClick: () => navigate("/fuel-management?tab=tanks"),
              }}
            />

            {/* Quick Actions Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle size="sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  New Sale
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <Fuel className="mr-2 h-4 w-4" />
                  Record Supply
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  Run Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
