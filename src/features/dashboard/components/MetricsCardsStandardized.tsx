import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { useTranslation } from 'react-i18next';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { TrendingUpIcon, TrendingDownIcon, DollarSignIcon, DropletIcon, CreditCardIcon, SunIcon } from 'lucide-react';

export function MetricsCardsStandardized() {
  const { t } = useTranslation();
  const { 
    data: dashboardMetrics,
    isLoading: isLoadingDashboardMetrics
  } = useDashboard();
  
  if (isLoadingDashboardMetrics) {
    return <div>{t('common.loading')}</div>;
  }
  
  // Helper function to render change value
  const renderChangeValue = (value: number) => {
    const Icon = value >= 0 ? TrendingUpIcon : TrendingDownIcon;
    const color = value >= 0 ? 'text-green-500' : 'text-red-500';
    
    return (
      <div className="flex items-center">
        <Icon className={`h-4 w-4 mr-1 ${color}`} />
        <span className={color}>
          {value >= 0 ? '+' : ''}{value}%
        </span>
      </div>
    );
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('dashboard.revenue')}
          </CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dashboardMetrics?.totalRevenue?.toLocaleString()}֏
          </div>
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            {renderChangeValue(dashboardMetrics?.revenueChange || 0)}
            <span className="ml-1">{t('dashboard.fromPreviousPeriod')}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('dashboard.fuelSales')}
          </CardTitle>
          <DropletIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dashboardMetrics?.totalLitersSold?.toLocaleString()} L
          </div>
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            {renderChangeValue(dashboardMetrics?.salesVolumeChange || 0)}
            <span className="ml-1">{t('dashboard.fromPreviousPeriod')}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('dashboard.expenses')}
          </CardTitle>
          <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dashboardMetrics?.totalExpenses?.toLocaleString()}֏
          </div>
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            {renderChangeValue(dashboardMetrics?.expensesChange || 0)}
            <span className="ml-1">{t('dashboard.fromPreviousPeriod')}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('dashboard.efficiency')}
          </CardTitle>
          <SunIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {dashboardMetrics?.efficiencyRatio?.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            {renderChangeValue(dashboardMetrics?.efficiencyChange || 0)}
            <span className="ml-1">{t('dashboard.fromPreviousPeriod')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 