
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { useTranslation } from "react-i18next";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/primitives/table";

export function SalesSummaryWidgetStandardized() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<"7d" | "14d" | "30d">("7d");

  const {
    data: dashboardData,
    isLoading,
    salesSummary,
    isLoadingSalesSummary,
  } = useDashboard();

  const handlePeriodChange = (value: string) => {
    setPeriod(value as "7d" | "14d" | "30d");
  };

  const isLoadingData = isLoading || isLoadingSalesSummary;

  if (isLoadingData) {
    return <div>{t("common.loading")}</div>;
  }

  // Use recent sales from dashboard data
  const recentSales = dashboardData?.sales?.slice(0, 5) || [];

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("dashboard.salesSummary")}</CardTitle>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("dashboard.selectPeriod")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">{t("dashboard.last7Days")}</SelectItem>
            <SelectItem value="14d">{t("dashboard.last14Days")}</SelectItem>
            <SelectItem value="30d">{t("dashboard.last30Days")}</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {t("dashboard.totalSales")}
            </p>
            <p className="text-2xl font-bold">
              {salesSummary?.total_sales?.toLocaleString() || 0}֏
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {t("dashboard.totalVolume")}
            </p>
            <p className="text-2xl font-bold">
              {salesSummary?.totalVolume?.toLocaleString() || 0} L
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {t("dashboard.averageSale")}
            </p>
            <p className="text-2xl font-bold">
              {salesSummary?.averageSale?.toLocaleString() || 0}֏
            </p>
          </div>
        </div>

        <p className="my-3 font-medium">{t("dashboard.recentSales")}</p>

        <div className="space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dashboard.date")}</TableHead>
                <TableHead>{t("dashboard.fuelType")}</TableHead>
                <TableHead>{t("dashboard.volume")}</TableHead>
                <TableHead className="text-right">
                  {t("dashboard.amount")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSales.map((sale: any) => (
                <TableRow key={sale.id}>
                  <TableCell>
                    {format(new Date(sale.created_at || sale.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>Fuel</TableCell>
                  <TableCell>{(sale.total_sold_liters || 0).toLocaleString()} L</TableCell>
                  <TableCell className="text-right">
                    {(sale.total_sales || 0).toLocaleString()}֏
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
