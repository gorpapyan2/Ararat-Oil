import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFuel } from '../hooks/useFuel';
import { FuelTankCard } from './FuelTankCard';
import { FuelSupplyList } from './FuelSupplyList';
import { FuelSaleList } from './FuelSaleList';

export function FuelManagementDashboard() {
  const { t } = useTranslation();
  const {
    tanks,
    isLoadingTanks,
    supplies,
    isLoadingSupplies,
    sales,
    isLoadingSales,
  } = useFuel();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('fuel.dashboard.title')}</h2>
        <p className="text-muted-foreground">{t('fuel.dashboard.description')}</p>
      </div>

      <Tabs defaultValue="tanks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tanks">{t('fuel.tabs.tanks')}</TabsTrigger>
          <TabsTrigger value="supplies">{t('fuel.tabs.supplies')}</TabsTrigger>
          <TabsTrigger value="sales">{t('fuel.tabs.sales')}</TabsTrigger>
        </TabsList>

        <TabsContent value="tanks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingTanks ? (
              <div>Loading tanks...</div>
            ) : (
              tanks.map((tank) => (
                <FuelTankCard key={tank.id} tank={tank} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="supplies" className="space-y-4">
          {isLoadingSupplies ? (
            <div>Loading supplies...</div>
          ) : (
            <FuelSupplyList supplies={supplies} />
          )}
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          {isLoadingSales ? (
            <div>Loading sales...</div>
          ) : (
            <FuelSaleList sales={sales} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 