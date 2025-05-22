import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/primitives/tabs";
import { useTranslation } from 'react-i18next';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { ProfitLossChart } from './ProfitLossChart';
import { RevenueExpensesChart } from './RevenueExpensesChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/primitives/select";

export function DashboardOverviewStandardized() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  
  const {
    data: dashboardMetrics,
    isLoading: isLoadingDashboardMetrics,
  } = useDashboard();
  
  const handlePeriodChange = (value: string) => {
    setPeriod(value as 'day' | 'week' | 'month');
  };
  
  if (isLoadingDashboardMetrics) {
    return <div>{t('common.loading')}</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h2>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('dashboard.selectPeriod')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{t('dashboard.today')}</SelectItem>
              <SelectItem value="week">{t('dashboard.thisWeek')}</SelectItem>
              <SelectItem value="month">{t('dashboard.thisMonth')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.totalRevenue')}
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics?.revenue?.toLocaleString()}֏
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardMetrics?.revenuePercentChange > 0 ? '+' : ''}
              {dashboardMetrics?.revenuePercentChange}% {t('dashboard.fromPrevious')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.fuelSold')}
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="M12 11c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics?.fuelSold?.toLocaleString()} L
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardMetrics?.fuelSoldPercentChange > 0 ? '+' : ''}
              {dashboardMetrics?.fuelSoldPercentChange}% {t('dashboard.fromPrevious')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.expenses')}
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics?.expenses?.toLocaleString()}֏
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardMetrics?.expensesPercentChange > 0 ? '+' : ''}
              {dashboardMetrics?.expensesPercentChange}% {t('dashboard.fromPrevious')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.profit')}
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardMetrics?.profit?.toLocaleString()}֏
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardMetrics?.profitPercentChange > 0 ? '+' : ''}
              {dashboardMetrics?.profitPercentChange}% {t('dashboard.fromPrevious')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">{t('dashboard.charts')}</TabsTrigger>
          <TabsTrigger value="recent">{t('dashboard.recentActivity')}</TabsTrigger>
        </TabsList>
        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <ProfitLossChart />
            <RevenueExpensesChart />
          </div>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          {/* Recent activity content goes here */}
        </TabsContent>
      </Tabs>
    </div>
  );
} 