import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/primitives/tabs";
import { Button } from "@/core/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/primitives/select";
import { ProfitLossChart } from '@/features/dashboard/components/ProfitLossChart';
import { RevenueExpensesChart } from '@/features/dashboard/components/RevenueExpensesChart';
import { useFinance } from '../hooks/useFinance';
import { ArrowUpRight, ArrowDownRight, CircleDollarSign, TrendingUp, Wallet } from 'lucide-react';

interface FinancialDashboardStandardizedProps {
  className?: string;
}

export function FinancialDashboardStandardized({ className }: FinancialDashboardStandardizedProps) {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    financialSummary, 
    isLoading,
    error 
  } = useFinance();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        {t('common.loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive bg-destructive bg-opacity-10 rounded-md">
        <h3 className="font-medium text-destructive">{t('common.error')}</h3>
        <p className="text-sm text-muted-foreground">{t('finance.error_loading_data')}</p>
      </div>
    );
  }

  const getTrendIcon = (value: number) => {
    return value >= 0 ? 
      <ArrowUpRight className="h-4 w-4 text-emerald-500" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  const formatTrendValue = (value: number) => {
    const formatted = Math.abs(value).toFixed(1);
    return `${value >= 0 ? '+' : '-'}${formatted}%`;
  };

  const renderMetricCard = (title: string, value: string, trend: number, icon: React.ReactNode) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>
          <div className="flex items-center space-x-1">
            {getTrendIcon(trend)}
            <span className={`text-xs ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {formatTrendValue(trend)}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{t('finance.financial_dashboard')}</h2>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={(val) => setPeriod(val as any)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t('finance.select_period')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{t('finance.last_7_days')}</SelectItem>
              <SelectItem value="30d">{t('finance.last_30_days')}</SelectItem>
              <SelectItem value="90d">{t('finance.last_90_days')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            {t('finance.export')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {renderMetricCard(
          t('finance.total_revenue'),
          financialSummary?.totalRevenue?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00',
          financialSummary?.revenueTrend || 0,
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        )}
        {renderMetricCard(
          t('finance.total_expenses'),
          financialSummary?.totalExpenses?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00',
          financialSummary?.expensesTrend || 0,
          <Wallet className="h-4 w-4 text-muted-foreground" />
        )}
        {renderMetricCard(
          t('finance.profit'),
          financialSummary?.profit?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00',
          financialSummary?.profitTrend || 0,
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        )}
        {renderMetricCard(
          t('finance.profit_margin'),
          `${financialSummary?.profitMargin?.toFixed(1) || 0}%`,
          financialSummary?.profitMarginTrend || 0,
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t('finance.overview')}</TabsTrigger>
          <TabsTrigger value="revenue_expenses">{t('finance.revenue_and_expenses')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('finance.profit_loss_over_time')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ProfitLossChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue_expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('finance.revenue_vs_expenses')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <RevenueExpensesChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 