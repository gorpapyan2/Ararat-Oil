import React, { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconGasStation, IconTank, IconTruck, IconArrowRight, IconFilter, IconRefresh, IconDroplet, IconFileText, IconAlertCircle } from "@tabler/icons-react";
import { FuelType, fuelTypesApi } from '@/core/api';
import type { FuelManagementSummary } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/format';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Lazy load chart components
const ConsumptionChart = lazy(() => import('./components/ConsumptionChart'));

export default function FuelManagementDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedTank, setSelectedTank] = useState<string>('all');
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | 'all'>('all');

  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['fuel-management', dateRange, selectedTank, selectedFuelType],
    queryFn: async () => {
      // For now, let's use a mock implementation that matches the component's expectations
      // In a real implementation, you would call the appropriate API endpoint
      return {
        tanks: {
          totalVolume: 15000,
          availableVolume: 8500,
          utilizationRate: 56,
          list: [],
          byType: {}
        },
        supplies: {
          total: 0,
          totalCost: 0,
          list: []
        },
        systems: {
          active: 0,
          total: 0
        },
        trends: {
          dailyConsumption: []
        }
      };
    }
  });

  // Clear all filters
  const clearAllFilters = () => {
    setDateRange(undefined);
    setSelectedTank('all');
    setSelectedFuelType('all');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : t('common.unknownError')}
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          {t('common.refresh')}
        </Button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('common.noData')}</AlertTitle>
          <AlertDescription>
            {t('common.noDataAvailable')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={t("fuelManagement.title")}
        description={t("fuelManagement.description")}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <IconRefresh className="h-4 w-4" />
              {t('common.refresh')}
            </Button>
          </div>
        }
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <IconGasStation className="h-5 w-5 mr-2 text-primary" />
              {t("common.addFuelEntry")}
            </CardTitle>
            <CardDescription className="text-xs">{t("fuelManagement.addFuelEntryDesc")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("fuel-supplies")}>
              {t("common.add")} <IconArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <IconTank className="h-5 w-5 mr-2 text-primary" />
              {t("common.startInventory")}
            </CardTitle>
            <CardDescription className="text-xs">{t("fuelManagement.startInventoryDesc")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("inventory/start")}>
              {t("common.start")} <IconArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base">
              <IconFileText className="h-5 w-5 mr-2 text-primary" />
              {t("common.generateReport")}
            </CardTitle>
            <CardDescription className="text-xs">{t("fuelManagement.generateReportDesc")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate("reports/generate")}>
              {t("common.generate")} <IconArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('fuelManagement.totalVolume')}
            </CardTitle>
            <IconDroplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.tanks.totalVolume)} L</div>
            <p className="text-xs text-muted-foreground">
              {t('fuelManagement.availableVolume', { volume: formatNumber(summary.tanks.availableVolume) })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('fuelManagement.totalSupplies')}
            </CardTitle>
            <IconTruck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.supplies.total)}</div>
            <p className="text-xs text-muted-foreground">
              {t('fuelManagement.totalCost', { amount: formatCurrency(summary.supplies.totalCost) })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('fuelManagement.utilizationRate')}
            </CardTitle>
            <IconTank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.tanks.utilizationRate)}%</div>
            <Progress value={summary.tanks.utilizationRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('fuelManagement.activeSystems')}
            </CardTitle>
            <IconGasStation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.systems.active}</div>
            <p className="text-xs text-muted-foreground">
              {t('fuelManagement.ofTotal', { total: summary.systems.total })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Consumption Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('fuelManagement.consumptionTrend')}</CardTitle>
                  <CardDescription>{t('fuelManagement.consumptionTrendDesc')}</CardDescription>
                </div>
                <Select defaultValue="week">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder={t('common.period')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">{t('common.week')}</SelectItem>
                    <SelectItem value="month">{t('common.month')}</SelectItem>
                    <SelectItem value="year">{t('common.year')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                }>
                  <ConsumptionChart data={summary.trends.dailyConsumption} />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Filters & Activity */}
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconFilter className="h-4 w-4" />
                  <CardTitle className="text-lg">{t('common.filters')}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  {t('common.clearAll')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('common.dateRange')}</label>
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('fuelManagement.selectTank')}</label>
                  <Select value={selectedTank} onValueChange={setSelectedTank}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('fuelManagement.selectTank')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common.all')}</SelectItem>
                      {summary.tanks.list.map(tank => (
                        <SelectItem key={tank.id} value={tank.id}>
                          {tank.name} ({tank.fuel_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('fuelManagement.selectFuelType')}</label>
                  <Select
                    value={selectedFuelType}
                    onValueChange={value => setSelectedFuelType(value as FuelType | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('fuelManagement.selectFuelType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common.all')}</SelectItem>
                      {Object.entries(summary.tanks.byType).map(([type, count]) => (
                        <SelectItem key={type} value={type}>
                          {type} ({count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t('fuelManagement.recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="supplies">
                <TabsList className="w-full">
                  <TabsTrigger value="supplies" className="flex-1">{t('fuelManagement.supplies')}</TabsTrigger>
                  <TabsTrigger value="levels" className="flex-1">{t('fuelManagement.tankLevels')}</TabsTrigger>
                </TabsList>
                <TabsContent value="supplies">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {(summary.supplies.list || []).map((supply) => (
                        <div key={supply.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div>
                            <div className="font-medium">{supply.fuel_type}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(supply.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatNumber(supply.quantity)} L</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(supply.cost)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="levels">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {summary.tanks.list.map((tank) => (
                        <div key={tank.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{tank.name}</div>
                            <Badge variant={'status' in tank && tank.status === 'active' ? 'default' : 'secondary'}>
                              {t('status.' + ('status' in tank ? tank.status : 'unknown'))}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{t('fuelManagement.currentLevel')}</span>
                              <span>{formatNumber(tank.current_level)} L</span>
                            </div>
                            <Progress value={(tank.current_level / tank.capacity) * 100} />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{t('fuelManagement.capacity')}</span>
                              <span>{formatNumber(tank.capacity)} L</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 