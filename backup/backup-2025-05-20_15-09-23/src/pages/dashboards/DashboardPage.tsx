import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { dashboardApi } from "@/core/api";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { PageHeader } from '@/core/components/ui/page-header';
import { BreadcrumbItem, Breadcrumbs } from '@/core/components/ui/breadcrumbs';
import { FuelManagementDashboard } from '@/features/dashboard/componentss/FuelManagementDashboard';
import { SalesDashboard } from '@/features/dashboard/componentss/SalesDashboard';
import { FinanceDashboard } from '@/features/dashboard/componentss/FinanceDashboard';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/ui/alert';
import { AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { DateRangePicker } from '@/core/components/ui/composed/date-range-picker';
import { apiNamespaces, getApiErrorMessage } from "@/i18n/i18n";

export function DashboardPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Date range state with default to last 30 days
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  
  // Format dates for API
  const formattedStartDate = useMemo(() => format(dateRange.from, "yyyy-MM-dd"), [dateRange.from]);
  const formattedEndDate = useMemo(() => 
    dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"), 
    [dateRange.to]
  );

  // Query dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard", formattedStartDate, formattedEndDate],
    queryFn: () => dashboardApi.getDashboardData({
      startDate: formattedStartDate,
      endDate: formattedEndDate
    }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoize the breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(() => [
    { name: t("navigation.dashboard"), href: "/" }
  ], [t]);

  // Get page title and description from translations
  const pageTitle = useMemo(() => t("dashboard.title", "Dashboard"), [t]);
  const pageDescription = useMemo(() => t("dashboard.description", "Overview of station performance"), [t]);

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
          title={pageTitle}
          description={pageDescription}
        >
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            calendarClassName="bg-card text-card-foreground"
            align="end"
            showCompare={false}
            popoverContentClassName="bg-card text-card-foreground border-border"
          />
        </PageHeader>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("common.error")}</AlertTitle>
          <AlertDescription>
            {error instanceof Error 
              ? error.message 
              : getApiErrorMessage(apiNamespaces.dashboard, 'fetch')}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">{t("dashboard.overview")}</TabsTrigger>
          <TabsTrigger value="fuel">{t("dashboard.fuelManagement")}</TabsTrigger>
          <TabsTrigger value="sales">{t("dashboard.salesAnalytics")}</TabsTrigger>
          <TabsTrigger value="finance">{t("dashboard.financialSummary")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid md:grid-cols-1 gap-4">
            <FuelManagementDashboard 
              isLoading={isLoading} 
              data={data?.data?.fuelManagement} 
            />
            <SalesDashboard 
              isLoading={isLoading} 
              data={data?.data?.sales}
              startDate={formattedStartDate}
              endDate={formattedEndDate}
            />
            <FinanceDashboard 
              isLoading={isLoading} 
              data={data?.data?.finance}
              startDate={formattedStartDate}
              endDate={formattedEndDate}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="fuel">
          <FuelManagementDashboard 
            isLoading={isLoading} 
            data={data?.data?.fuelManagement} 
            expanded={true}
          />
        </TabsContent>
        
        <TabsContent value="sales">
          <SalesDashboard 
            isLoading={isLoading} 
            data={data?.data?.sales}
            expanded={true}
            startDate={formattedStartDate}
            endDate={formattedEndDate}
          />
        </TabsContent>
        
        <TabsContent value="finance">
          <FinanceDashboard 
            isLoading={isLoading} 
            data={data?.data?.finance}
            expanded={true}
            startDate={formattedStartDate}
            endDate={formattedEndDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 