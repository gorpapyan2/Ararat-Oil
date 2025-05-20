import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/primitives/card';
import { useTranslation } from 'react-i18next';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { Progress } from '@/core/components/ui/primitives/progress';
import { Badge } from '@/core/components/ui/primitives/badge';

export function FuelLevelVisualizationStandardized() {
  const { t } = useTranslation();
  const { tankLevels, isLoadingTankLevels } = useDashboard();
  
  if (isLoadingTankLevels) {
    return <div>{t('common.loading')}</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.fuelLevels')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tankLevels?.map((tank) => {
          // Calculate percentage for the progress bar
          const percentage = (tank.current_volume / tank.capacity) * 100;
          // Determine status based on percentage
          let status: 'low' | 'medium' | 'high' = 'medium';
          let statusColor = '';
          
          if (percentage < 20) {
            status = 'low';
            statusColor = 'text-red-500';
          } else if (percentage >= 80) {
            status = 'high';
            statusColor = 'text-green-500';
          }
          
          return (
            <div key={tank.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{tank.fuel_type}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('tanks.tankNumber', { number: tank.tank_number })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {tank.current_volume.toLocaleString()} L
                    <span className="text-sm text-muted-foreground"> / {tank.capacity.toLocaleString()} L</span>
                  </p>
                  <Badge variant={
                    status === 'low' ? 'destructive' : 
                    status === 'high' ? 'default' : 'secondary'
                  }>
                    {percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={percentage} 
                className={
                  status === 'low' ? 'bg-red-100' : 
                  status === 'high' ? 'bg-green-100' : 'bg-gray-100'
                }
              />
            </div>
          );
        })}
        
        {tankLevels?.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">{t('dashboard.noTanksAvailable')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 