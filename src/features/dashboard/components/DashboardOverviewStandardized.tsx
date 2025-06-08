
import React from "react";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { MetricCard } from "@/core/components/ui/enhanced/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Fuel, Receipt, TrendingUpIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DashboardOverviewStandardized() {
  const { t } = useTranslation();
  const { data: dashboardMetrics, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-24 mb-2"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            {t("dashboard.errorLoadingData")}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!dashboardMetrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            {t("dashboard.noDataAvailable")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Revenue Card */}
      <MetricCard
        title={t("dashboard.totalRevenue")}
        value={`${dashboardMetrics.revenue?.toLocaleString() || 0}֏`}
        description={
          dashboardMetrics.revenuePercentChange !== undefined 
            ? `${dashboardMetrics.revenuePercentChange >= 0 ? "+" : ""}${dashboardMetrics.revenuePercentChange}% ${t("dashboard.fromLastMonth")}`
            : t("dashboard.noChangeData")
        }
        icon={DollarSign}
        trend={
          dashboardMetrics.revenuePercentChange !== undefined
            ? dashboardMetrics.revenuePercentChange >= 0 ? "up" : "down"
            : "neutral"
        }
      />

      {/* Fuel Sold Card */}
      <MetricCard
        title={t("dashboard.fuelSold")}
        value={`${dashboardMetrics.fuelSold?.toLocaleString() || 0} L`}
        description={
          dashboardMetrics.fuelSoldPercentChange !== undefined
            ? `${dashboardMetrics.fuelSoldPercentChange >= 0 ? "+" : ""}${dashboardMetrics.fuelSoldPercentChange}% ${t("dashboard.fromLastMonth")}`
            : t("dashboard.noChangeData")
        }
        icon={Fuel}
        trend={
          dashboardMetrics.fuelSoldPercentChange !== undefined
            ? dashboardMetrics.fuelSoldPercentChange >= 0 ? "up" : "down"
            : "neutral"
        }
      />

      {/* Expenses Card */}
      <MetricCard
        title={t("dashboard.totalExpenses")}
        value={`${dashboardMetrics.totalExpenses?.toLocaleString() || 0}֏`}
        description={
          dashboardMetrics.expensesPercentChange !== undefined
            ? `${dashboardMetrics.expensesPercentChange >= 0 ? "+" : ""}${dashboardMetrics.expensesPercentChange}% ${t("dashboard.fromLastMonth")}`
            : t("dashboard.noChangeData")
        }
        icon={Receipt}
        trend={
          dashboardMetrics.expensesPercentChange !== undefined
            ? dashboardMetrics.expensesPercentChange <= 0 ? "up" : "down"
            : "neutral"
        }
      />

      {/* Profit Card */}
      <MetricCard
        title={t("dashboard.netProfit")}
        value={`${dashboardMetrics.profit?.toLocaleString() || 0}֏`}
        description={
          dashboardMetrics.profitPercentChange !== undefined
            ? `${dashboardMetrics.profitPercentChange >= 0 ? "+" : ""}${dashboardMetrics.profitPercentChange}% ${t("dashboard.fromLastMonth")}`
            : t("dashboard.noChangeData")
        }
        icon={TrendingUpIcon}
        trend={
          dashboardMetrics.profitPercentChange !== undefined
            ? dashboardMetrics.profitPercentChange >= 0 ? "up" : "down"
            : "neutral"
        }
      />
    </div>
  );
}
