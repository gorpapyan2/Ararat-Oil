import {
  TrendingUp,
  DollarSign,
  Fuel,
  ArrowUp,
  ArrowDown,
  PieChart,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { useEffect, useMemo } from "react";
import { useToast } from "@/hooks";
import { CardGrid, MetricCardProps } from "@/core/components/ui/composed/card";
import { Skeleton } from "@/core/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { fetchDashboardData } from "../services/dashboard";
import type { DashboardData } from "../types";

export function DashboardMetrics() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<DashboardData>({
    queryKey: ["dashboard", user?.id],
    queryFn: fetchDashboardData,
    enabled: !!user,
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading dashboard data",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

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

    if (!dashboardData) {
      return [];
    }

    return [
      {
        title: t("dashboard.totalSales"),
        value: `${dashboardData.totalSales.toLocaleString()} ֏`,
        description: "+20.1% from last month",
        icon: DollarSign,
      },
      {
        title: t("dashboard.totalExpenses"),
        value: `${dashboardData.totalExpenses.toLocaleString()} ֏`,
        description: "+19% from last month",
        icon: TrendingUp,
      },
      {
        title: t("dashboard.netProfit"),
        value: `${dashboardData.netProfit.toLocaleString()} ֏`,
        description: "+15% from last month",
        icon: dashboardData.netProfit >= 0 ? ArrowUp : ArrowDown,
        iconColor:
          dashboardData.netProfit >= 0 ? "text-green-500" : "text-red-500",
      },
      {
        title: t("dashboard.inventoryValue"),
        value: `${dashboardData.inventoryValue.toLocaleString()} ֏`,
        description: "Based on current tank levels",
        icon: Fuel,
      },
    ];
  }, [isLoading, dashboardData, t]);

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <h3 className="font-medium mb-1">Error loading dashboard data</h3>
        <p className="text-sm">
          {error.message ||
            "There was an error loading the dashboard metrics. Please try again later."}
        </p>
      </div>
    );
  }

  return <CardGrid metrics={metrics} />;
}
