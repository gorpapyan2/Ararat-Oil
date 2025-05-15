import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/core/api/supabase";
import { CalendarClock, Receipt, CircleDollarSign, ArrowRight, BarChart3, ChevronRight, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinanceDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch summary data for each section
  const { data: shiftsData } = useQuery({
    queryKey: ["shifts-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("shifts")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return { count };
    }
  });

  const { data: salesData } = useQuery({
    queryKey: ["sales-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("sales")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return { count };
    }
  });

  const { data: expensesData } = useQuery({
    queryKey: ["expenses-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("expenses")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return { count };
    }
  });

  const { data: financeOverview } = useQuery({
    queryKey: ["finance-overview"],
    queryFn: async () => {
      // In a real app, you would fetch this data from your API
      // For now, returning sample data
      return {
        total_sales: 1250000,
        total_expenses: 450000,
        net_profit: 800000,
      };
    }
  });

  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("common.financeManagement")}
        description={t("finance.description") || "Manage your financial operations including shifts, sales, and expenses"}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Shifts Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CalendarClock className="mr-2 h-5 w-5 text-primary" />
              {t("common.shifts")}
            </CardTitle>
            <CardDescription>
              {t("shifts.description") || "Manage your work shifts and cash operations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{shiftsData?.count || 0}</div>
            <p className="text-sm text-muted-foreground">
              {t("shifts.totalCount", { count: shiftsData?.count || 0 })}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => navigate("/finance/shifts")}
            >
              {t("common.manage")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Sales Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-primary" />
              {t("common.sales")}
            </CardTitle>
            <CardDescription>
              {t("sales.description") || "Track and manage all your sales transactions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{salesData?.count || 0}</div>
            <p className="text-sm text-muted-foreground">
              {t("sales.totalRevenue", { amount: formatCurrency(financeOverview?.total_sales || 0) })}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => navigate("/finance/sales")}
            >
              {t("common.manage")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Expenses Card */}
        <Card className="flex flex-col h-full col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('finance.expenses.title', 'Expenses')}
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(expensesData?.count || 0).toString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('finance.expenses.description', 'Track and manage business expenses')}
            </p>
          </CardContent>
          <CardFooter className="mt-auto pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between"
              onClick={() => navigate('/finance/expenses')}
            >
              <span>{t('common.manage', 'Manage')}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
          <CardFooter className="pt-2">
            <Button
              variant="default"
              size="sm"
              className="w-full justify-between"
              onClick={() => navigate('/finance/expenses/create')}
            >
              <span>{t('common.add', 'Add New')}</span>
              <Plus className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Profit & Loss Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              {t("finance.profitLoss")}
            </CardTitle>
            <CardDescription>
              {t("finance.profitLossDescription") || "Review financial performance and analysis"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(financeOverview?.net_profit || 0)}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("finance.netProfit")}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => navigate("/finance/profit-loss")}
            >
              {t("common.view")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 