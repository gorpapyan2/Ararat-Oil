import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProfitLossSummary } from "@/services/profit-loss";
import { ProfitLossSummary } from "@/types";

export function ProfitLossManagerStandardized() {
  const { t } = useTranslation();

  // Fetch profit and loss summary
  const { data: summary, isLoading } = useQuery({
    queryKey: ["profit-loss-summary"],
    queryFn: fetchProfitLossSummary,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("finance.profitLoss.loading", "Loading...")}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!summary || (Array.isArray(summary) && summary.length === 0)) {
    return (
      <div className="text-center text-muted-foreground">
        {t("finance.profitLoss.noData", "No profit and loss data available")}
      </div>
    );
  }

  // Calculate totals
  const totalSales = (summary as ProfitLossSummary[]).reduce((sum, item) => sum + item.total_sales, 0);
  const totalExpenses = (summary as ProfitLossSummary[]).reduce((sum, item) => sum + item.total_expenses, 0);
  const totalProfit = (summary as ProfitLossSummary[]).reduce((sum, item) => sum + item.profit, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("finance.profitLoss.totalSales", "Total Sales")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales.toFixed(2)} ֏</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("finance.profitLoss.totalExpenses", "Total Expenses")}
            </CardTitle>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses.toFixed(2)} ֏</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("finance.profitLoss.totalProfit", "Total Profit")}
            </CardTitle>
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProfit.toFixed(2)} ֏</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("finance.profitLoss.periodicSummary", "Periodic Summary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <div className="font-medium">{item.period}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(item.created_at || ""), "PP")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {t("finance.profitLoss.profit", "Profit")}: {item.profit.toFixed(2)} ֏
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("finance.profitLoss.sales", "Sales")}: {item.total_sales.toFixed(2)} ֏
                    {" | "}
                    {t("finance.profitLoss.expenses", "Expenses")}: {item.total_expenses.toFixed(2)} ֏
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 