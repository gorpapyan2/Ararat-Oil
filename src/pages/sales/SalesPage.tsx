import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FilterIcon, DownloadIcon, PlusCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { useToast } from "@/hooks";
import { salesApi } from "@/core/api";
import { apiNamespaces, getApiErrorMessage, getApiSuccessMessage, getApiActionLabel } from "@/i18n/i18n";

// Components
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageHeader } from "@/components/ui/page-header";
import { SalesTable } from "@/components/tables/sales/SalesTable";
import { SalesFilterPanel } from "@/components/sales/SalesFilterPanel";
import { DateRangePicker } from "@/components/ui/composed/date-range-picker";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

export function SalesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Memoize the breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(() => [
    { name: t("navigation.dashboard"), href: "/" },
    { name: t("navigation.sales"), href: "/sales" },
  ], [t]);

  // Get page title and description from translations
  const pageTitle = useMemo(() => t("sales.title", "Sales"), [t]);
  const pageDescription = useMemo(() => t("sales.description", "Manage and track all sales transactions"), [t]);

  // Date range state with default to current month
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async () => {
      const formattedFrom = format(dateRange.from, "yyyy-MM-dd");
      const formattedTo = dateRange.to 
        ? format(dateRange.to, "yyyy-MM-dd") 
        : formattedFrom;
      
      return await salesApi.exportSales({
        startDate: formattedFrom,
        endDate: formattedTo,
        format: "csv"
      });
    },
    onSuccess: (data) => {
      // Create a Blob from the CSV data
      const blob = new Blob([data], { type: "text/csv;charset=utf-8" });
      
      // Generate filename with current date
      const fileName = `sales_export_${format(new Date(), "yyyy-MM-dd")}.csv`;
      
      // Save file
      saveAs(blob, fileName);
      
      toast({
        title: t("common.success"),
        description: getApiSuccessMessage(apiNamespaces.sales, 'export'),
      });
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: error instanceof Error 
          ? error.message 
          : getApiErrorMessage(apiNamespaces.sales, 'export'),
        variant: "destructive",
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => salesApi.deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast({
        title: t("common.success"),
        description: getApiSuccessMessage(apiNamespaces.sales, 'delete'),
      });
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description: error instanceof Error 
          ? error.message 
          : getApiErrorMessage(apiNamespaces.sales, 'delete'),
        variant: "destructive",
      });
    }
  });

  // Handle delete confirmation
  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  // Handle export button click
  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync();
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <Breadcrumbs>
        {breadcrumbSegments.map((segment, index) => (
          <BreadcrumbItem key={index} href={segment.href}>
            {segment.name}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>

      <div className="my-4">
        <PageHeader
          heading={pageTitle}
          subheading={pageDescription}
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
                  />
                </ScrollArea>
              </SheetContent>
            </Sheet>
            
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              calendarClassName="bg-card text-card-foreground"
              align="end"
              showCompare={false}
              popoverContentClassName="bg-card text-card-foreground border-border"
            />

            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={handleExport}
              disabled={exportMutation.isPending}
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              <span>{t("sales.export")}</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="h-8 gap-1"
              onClick={() => navigate("/sales/new")}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>{getApiActionLabel(apiNamespaces.sales, 'create')}</span>
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
          startDate={format(dateRange.from, "yyyy-MM-dd")}
          endDate={dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
} 