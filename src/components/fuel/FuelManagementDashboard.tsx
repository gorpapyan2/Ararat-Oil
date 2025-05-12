import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { fuelManagementService, FuelType, type FuelManagementSummary } from '@/services/fuelManagement';
import { formatCurrency, formatNumber } from '@/utils/format';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

export function FuelManagementDashboard() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [selectedTank, setSelectedTank] = useState<string>('all');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('all');

  const { data: summary, isLoading } = useQuery<FuelManagementSummary>({
    queryKey: ['fuel-management', dateRange, selectedTank, selectedFuelType],
    queryFn: () => fuelManagementService.getSummary({
      startDate: dateRange?.from.toISOString(),
      endDate: dateRange?.to.toISOString(),
      tankId: selectedTank !== 'all' ? selectedTank : undefined,
      fuelType: selectedFuelType !== 'all' ? selectedFuelType as FuelType : undefined
    })
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!summary) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('fuel.management.title')}</h2>
        <div className="flex items-center gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={(date) => {
              if (date?.from && date?.to) {
                setDateRange({ from: date.from, to: date.to });
              } else {
                setDateRange(undefined);
              }
            }}
          />
          <Select value={selectedTank} onValueChange={setSelectedTank}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('fuel.management.selectTank')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              {/* Add tank options here */}
            </SelectContent>
          </Select>
          <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('fuel.management.selectFuelType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              {/* Add fuel type options here */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('fuel.management.totalTanks')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.tanks.total}</div>
            <p className="text-xs text-muted-foreground">
              {t('fuel.management.utilizationRate', { rate: summary.tanks.utilizationRate.toFixed(1) })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('fuel.management.totalSupplies')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.supplies.total}</div>
            <p className="text-xs text-muted-foreground">
              {t('fuel.management.totalQuantity', { quantity: formatNumber(summary.supplies.totalQuantity) })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('fuel.management.totalCost')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.supplies.totalCost)}</div>
            <p className="text-xs text-muted-foreground">
              {t('fuel.management.averagePrice', { price: formatCurrency(summary.supplies.averagePrice) })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('fuel.management.activeSystems')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.systems.active}</div>
            <p className="text-xs text-muted-foreground">
              {t('fuel.management.totalSystems', { total: summary.systems.total })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent-activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent-activity">{t('fuel.management.recentActivity')}</TabsTrigger>
          <TabsTrigger value="tank-levels">{t('fuel.management.tankLevels')}</TabsTrigger>
        </TabsList>

        <TabsContent value="recent-activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('fuel.management.recentSupplies')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.recentActivity.supplies.map((supply) => (
                  <div key={supply.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{supply.supplier}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(supply.delivery_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatNumber(supply.quantity_liters)} L</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(supply.total_cost)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tank-levels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('fuel.management.levelChanges')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.recentActivity.levelChanges.map((change, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{change.tank_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(change.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {change.change_type === 'add' ? '+' : '-'}
                        {formatNumber(change.change_amount)} L
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(change.new_level)} L
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 