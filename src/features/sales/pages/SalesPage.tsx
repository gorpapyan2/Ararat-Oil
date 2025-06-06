import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FilterIcon,
  DownloadIcon,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks";

// Components
import { Button } from "@/core/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/core/components/ui/alert";
import { PageHeader } from "@/core/components/ui/page-header";
import {
  SalesTable,
  SalesFilterPanel,
  useSalesQuery,
  useExportSales,
  SalesFilters,
} from "@/features/sales";
import { Sheet, SheetContent, SheetTrigger } from "@/core/components/ui/sheet";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salesApi } from "@/core/api";

export function SalesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Date range state with default to current month
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  // Convert date range to filters
  const filters: SalesFilters = useMemo(
    () => ({
      dateRange: {
        from: dateRange.from,
        to: dateRange.to,
      },
    }),
    [dateRange]
  );

  // Use our custom hooks
  const { data: sales = [], isLoading } = useSalesQuery(filters);
  const { exportSalesData, isExporting } = useExportSales();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => salesApi.deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  // Handle filter changes
  const handleFiltersChange = (newFilters: SalesFilters) => {
    // If the filters include a date range, update our local state
    if (newFilters.dateRange) {
      setDateRange({
        from: newFilters.dateRange.from,
        to: newFilters.dateRange.to,
      });
    }
  };

  // Handle delete confirmation
  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: t("common.success"),
        description: t("sales.deleteSuccess", "Sale deleted successfully"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("sales.deleteError", "Failed to delete sale"),
        variant: "destructive",
      });
    }
  };

  // Handle export button click
  const handleExport = async () => {
    try {
      await exportSalesData({
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: dateRange.to
          ? format(dateRange.to, "yyyy-MM-dd")
          : format(dateRange.from, "yyyy-MM-dd"),
        format: "csv",
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("sales.exportError", "Failed to export sales data"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="container py-6 max-w-7xl mx-auto">
        <div className="my-4">
          <PageHeader
            title={t("sales.title", "Sales")}
            description={t(
              "sales.description",
              "Manage and track all sales transactions"
            )}
            className="text-white"
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1 bg-gray-800/50 border-gray-700/50 text-white hover:bg-gray-800/70">
                    <FilterIcon className="h-3.5 w-3.5" />
                    <span>{t("common.filter")}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md bg-gray-900 border-gray-700">
                  <ScrollArea className="h-[calc(100vh-80px)] pr-4">
                    <SalesFilterPanel
                      onClose={() => setIsFilterOpen(false)}
                      onFiltersChange={handleFiltersChange}
                    />
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 bg-gray-800/50 border-gray-700/50 text-white hover:bg-gray-800/70"
                onClick={handleExport}
                disabled={isExporting}
              >
                <DownloadIcon className="h-3.5 w-3.5" />
                <span>{t("sales.export", "Export")}</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                className="h-8 gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate("/sales/new")}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>{t("sales.create", "New Sale")}</span>
              </Button>
            </div>
          </PageHeader>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Alert for when no data might be available */}
          {(dateRange.from > new Date() ||
            (dateRange.to &&
              dateRange.to <
                new Date(Date.now() - 365 * 24 * 60 * 60 * 1000))) && (
            <Alert variant="default" className="bg-yellow-900/20 border-yellow-500/50 text-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertTitle className="text-yellow-100">{t("common.notice")}</AlertTitle>
              <AlertDescription className="text-yellow-200">
                {t(
                  "sales.dateRangeWarning",
                  "The selected date range may not contain any data. Consider adjusting your date filter."
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Sales Table */}
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl">
            <SalesTable
              sales={sales}
              isLoading={isLoading}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
