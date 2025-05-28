import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FilterIcon,
  DownloadIcon,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import { useToast } from "@/hooks";
import { expensesApi } from "@/core/api";
import {
  apiNamespaces,
  getApiErrorMessage,
  getApiSuccessMessage,
  getApiActionLabel,
} from "@/i18n/i18n";

// Components
import { Breadcrumbs, BreadcrumbItem } from "@/core/components/ui/breadcrumbs";
import { Button } from "@/core/components/ui/button";
import { PageHeader } from "@/core/components/ui/page-header";
import { ExpensesTableStandardized } from "@/features/finance/components/ExpensesTableStandardized";
import { FilterPanel } from "@/features/expenses/components/FilterPanel";
import { DateRangePicker } from "@/core/components/ui/composed/date-range-picker";
import { Sheet, SheetContent, SheetTrigger } from "@/core/components/ui/sheet";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/core/components/ui/alert";

export function ExpensesPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Memoize the breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(
    () => [
      { name: t("navigation.dashboard"), href: "/" },
      { name: t("navigation.financials"), href: "/finance" },
      { name: t("navigation.expenses"), href: "/expenses" },
    ],
    [t]
  );

  // Get page title and description from translations
  const pageTitle = useMemo(() => t("expenses.title", "Expenses"), [t]);
  const pageDescription = useMemo(
    () =>
      t(
        "expenses.description",
        "Track and manage all expenses across the station"
      ),
    [t]
  );

  // Function to parse date from search params or return today - 30 days
  const getDefaultStartDate = () => {
    const startParam = searchParams.get("startDate");
    if (startParam) {
      const date = new Date(startParam);
      return isNaN(date.getTime())
        ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        : date;
    }
    return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  };

  // Function to parse date from search params or return today
  const getDefaultEndDate = () => {
    const endParam = searchParams.get("endDate");
    if (endParam) {
      const date = new Date(endParam);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  };

  // Handle date range selection
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: getDefaultStartDate(),
    to: getDefaultEndDate(),
  });

  // Export mutation
  const exportMutation = useMutation({
    mutationFn: async () => {
      const formattedFrom = format(dateRange.from, "yyyy-MM-dd");
      const formattedTo = dateRange.to
        ? format(dateRange.to, "yyyy-MM-dd")
        : formattedFrom;

      const response = await expensesApi.exportExpenses({
        startDate: formattedFrom,
        endDate: formattedTo,
        format: "csv",
      });

      return response;
    },
    onSuccess: (data) => {
      // Create a Blob from the CSV data
      const blob = new Blob([data], { type: "text/csv;charset=utf-8" });

      // Generate filename with current date
      const fileName = `expenses_export_${format(new Date(), "yyyy-MM-dd")}.csv`;

      // Save file
      saveAs(blob, fileName);

      toast({
        title: t("common.success"),
        description: getApiSuccessMessage(apiNamespaces.expenses, "export"),
      });
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description:
          error instanceof Error
            ? error.message
            : getApiErrorMessage(apiNamespaces.expenses, "export"),
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast({
        title: t("common.success"),
        description: getApiSuccessMessage(apiNamespaces.expenses, "delete"),
      });
    },
    onError: (error) => {
      toast({
        title: t("common.error"),
        description:
          error instanceof Error
            ? error.message
            : getApiErrorMessage(apiNamespaces.expenses, "delete"),
        variant: "destructive",
      });
    },
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
        <PageHeader heading={pageTitle} subheading={pageDescription}>
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
                  <FilterPanel onClose={() => setIsFilterOpen(false)} />
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
              <span>{t("expenses.export")}</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="h-8 gap-1"
              onClick={() => navigate("/expenses/new")}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>{getApiActionLabel(apiNamespaces.expenses, "create")}</span>
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
          <Alert variant="default" className="bg-muted border-amber-500/50">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle>{t("common.notice")}</AlertTitle>
            <AlertDescription>
              {t(
                "expenses.dateRangeWarning",
                "The selected date range may not contain any data. Consider adjusting your date filter."
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Expenses Table */}
        <ExpensesTableStandardized
          startDate={format(dateRange.from, "yyyy-MM-dd")}
          endDate={
            dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined
          }
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
