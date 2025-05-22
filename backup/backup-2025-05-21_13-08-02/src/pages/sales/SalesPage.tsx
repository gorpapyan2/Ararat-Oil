import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FilterIcon, DownloadIcon, PlusCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks";

// Components
import { Button } from "@/core/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from '@/core/components/ui/alert';
import { PageHeader } from '@/core/components/ui/page-header';
import { 
  SalesTable, 
  SalesFilterPanel, 
  useSalesQuery,
  useExportSales,
  SalesFilters
} from "@/features/sales";
import { Sheet, SheetContent, SheetTrigger } from "@/core/components/ui/sheet";
import { ScrollArea } from '@/core/components/ui/scroll-area';
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
  const filters: SalesFilters = useMemo(() => ({
    dateRange: {
      from: dateRange.from,
      to: dateRange.to
    }
  }), [dateRange]);

  // Use our custom hooks
  const { data: sales = [], isLoading } = useSalesQuery(filters);
  const { exportSalesData, isExporting } = useExportSales();
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => salesApi.deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    }
  });

  // Handle filter changes
  const handleFiltersChange = (newFilters: SalesFilters) => {
    // If the filters include a date range, update our local state
    if (newFilters.dateRange) {
      setDateRange({
        from: newFilters.dateRange.from,
        to: newFilters.dateRange.to
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
        endDate: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : format(dateRange.from, "yyyy-MM-dd"),
        format: "csv"
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
    <div className="container py-6 max-w-7xl mx-auto">
      <div className="my-4">
        <PageHeader
          title={t("sales.title", "Sales")}
          description={t("sales.description", "Manage and track all sales transactions")}
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <FilterIcon className="h-3.5 w-3.5" />
                  <span>{t("common.filter")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-md">
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
              className="h-8 gap-1"
              onClick={handleExport}
              disabled={isExporting}
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              <span>{t("sales.export", "Export")}</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="h-8 gap-1"
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
        {(dateRange.from > new Date() || (dateRange.to && dateRange.to < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000))) && (
          <Alert variant="default" className="bg-muted border-amber-500/50">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle>{t("common.notice")}</AlertTitle>
            <AlertDescription>
              {t("sales.dateRangeWarning", "The selected date range may not contain any data. Consider adjusting your date filter.")}
            </AlertDescription>
          </Alert>
        )}

        {/* Sales Table */}
        <SalesTable
          sales={sales}
          isLoading={isLoading}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
} 