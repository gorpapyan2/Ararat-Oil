import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
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

// Import API services
import { fetchDashboardData, type DashboardData } from "@/services/dashboard";

export default function Dashboard() {
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  // Fetch dashboard data from API
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading,
    error: dashboardError
  } = useQuery<DashboardData>({
    queryKey: ["dashboard", session?.user?.id],
    queryFn: fetchDashboardData,
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
    if (dashboardError) {
      toast({
        title: "Error loading dashboard data",
        description: dashboardError.message,
        variant: "destructive",
      });
    }
  }, [salesError, expensesError, tanksError, dashboardError, toast]);

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

  const isLoading = isSalesLoading || isExpensesLoading || isTanksLoading || isDashboardLoading;
  const hasError = !!salesError || !!expensesError || !!tanksError || !!dashboardError;

  // Mock data for trends (in a real app, this would come from the API)
  const mockTrends = {
    sales: { value: "8.2%", positive: true },
    expenses: { value: "4.1%", positive: false },
    profit: { value: "12.5%", positive: true },
    inventory: { value: "2.7%", positive: true },
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} ֏`;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        actions={
          <Button variant="outline" size="sm">
            <CalendarRange className="mr-2 h-4 w-4" />
            {t("dashboard.last30Days")}
          </Button>
        }
      />

      {/* KPI Metrics Grid */}
      <section aria-label={t("dashboard.keyPerformanceIndicators")}>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Sales Metric */}
          <MetricCard
            title={t("dashboard.totalSales")}
            value={isLoading ? t("common.loading") : formatCurrency(totalSales)}
            icon={<DollarSign className="h-5 w-5" />}
            trend={
              !isLoading
                ? {
                    value: mockTrends.sales.value,
                    positive: mockTrends.sales.positive,
                    label: t("dashboard.vsLastMonth"),
                  }
                : undefined
            }
            loading={isLoading}
            onClick={() => navigate("/sales")}
          />

          {/* Expenses Metric */}
          <MetricCard
            title={t("dashboard.totalExpenses")}
            value={isLoading ? t("common.loading") : formatCurrency(totalExpenses)}
            icon={<TrendingUp className="h-5 w-5" />}
            trend={
              !isLoading
                ? {
                    value: mockTrends.expenses.value,
                    positive: mockTrends.expenses.positive,
                    label: t("dashboard.vsLastMonth"),
                  }
                : undefined
            }
            loading={isLoading}
            onClick={() => navigate("/expenses")}
          />

          {/* Net Profit Metric */}
          <MetricCard
            title={t("dashboard.netProfit")}
            value={isLoading ? t("common.loading") : formatCurrency(netProfit)}
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
                    label: t("dashboard.vsLastMonth"),
                  }
                : undefined
            }
            loading={isLoading}
            className={netProfit < 0 ? "border-red-200" : ""}
          />

          {/* Inventory Value Metric */}
          <MetricCard
            title={t("dashboard.inventoryValue")}
            value={isLoading ? t("common.loading") : formatCurrency(inventoryValue)}
            icon={<Fuel className="h-5 w-5" />}
            trend={
              !isLoading
                ? {
                    value: mockTrends.inventory.value,
                    positive: mockTrends.inventory.positive,
                    label: t("dashboard.vsLastMonth"),
                  }
                : undefined
            }
            loading={isLoading}
            onClick={() => navigate("/fuel-management?tab=tanks")}
          />
        </div>
      </section>

      {/* Charts and Additional Info */}
      <section aria-label={t("dashboard.chartsAdditionalInfo")}>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {/* Main Chart - Takes up 2/3 of the space on large screens */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle size="md">{t("dashboard.revenueExpensesOverview")}</CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart4 className="mx-auto h-16 w-16 mb-4 opacity-50" />
                <p>{t("dashboard.chartImplementationNote")}</p>
                <p className="text-sm mt-2">
                  {t("dashboard.showingDataLast6Months")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right sidebar with additional cards */}
          <div className="space-y-4">
            {/* Staff Activity Card */}
            <ActionCard
              title={t("dashboard.staffPerformance")}
              description={t("dashboard.staffPerformanceDescription")}
              status="success"
              icon={<Users className="h-5 w-5" />}
              actionLabel={t("dashboard.viewEmployeeDetails")}
              onAction={() => navigate("/employees")}
            />

            {/* Fuel Levels Summary */}
            <SummaryCard
              title={t("dashboard.fuelInventoryStatus")}
              metrics={[
                { label: t("common.petrol"), value: "85%", color: "success" },
                { label: t("common.diesel"), value: "62%", color: "default" },
                { label: t("common.cng"), value: "28%", color: "warning" },
                { label: "Kerosene", value: "91%", color: "success" },
              ]}
              action={{
                label: t("dashboard.viewAllTanks"),
                onClick: () => navigate("/fuel-management?tab=tanks"),
              }}
            />

            {/* Quick Actions Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle size="sm">{t("dashboard.quickActions")}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  {t("dashboard.newSale")}
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {t("dashboard.addExpense")}
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <Fuel className="mr-2 h-4 w-4" />
                  {t("dashboard.recordSupply")}
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  {t("dashboard.runReport")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
