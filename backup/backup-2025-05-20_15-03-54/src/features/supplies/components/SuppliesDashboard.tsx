import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@sentry/react';
import { KpiCardGrid } from './KpiCardGrid';
import { SuppliesTable } from './SuppliesTable';
import { useSuppliesFilters } from '../store/useSuppliesFilters';
import { fetchFuelSupplies } from '@/services/fuel-supplies';
import { fetchFuelTanks } from '@/services/tanks';
import { Button } from '@/core/components/ui/primitives/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { FuelSuppliesManagerStandardized } from '@/features/fuel-supplies/components/FuelSuppliesManagerStandardized';
import { motion } from 'framer-motion';

export function SuppliesDashboard() {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const filters = useSuppliesFilters();

  // Fetch data with filters
  const { data: supplies, isLoading: isLoadingSupplies } = useQuery({
    queryKey: ['fuel-supplies', filters],
    queryFn: () => fetchFuelSupplies(filters),
  });

  const { data: tanks = [] } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fetchFuelTanks,
  });

  // Calculate summary data
  const summary = {
    totalLiters: supplies?.reduce((sum, s) => sum + s.quantity_liters, 0) || 0,
    totalCost: supplies?.reduce((sum, s) => sum + s.total_cost, 0) || 0,
    lastDelivery: supplies?.[0]?.delivery_date || new Date().toISOString(),
    currentTankLevel: tanks.reduce((sum, t) => sum + t.current_level, 0),
    tankCapacity: tanks.reduce((sum, t) => sum + t.capacity, 0),
    byFuelType: supplies?.reduce((acc, s) => {
      const type = s.tank?.fuel_type || 'unknown';
      if (!acc[type]) {
        acc[type] = { quantity: 0, cost: 0, averagePrice: 0 };
      }
      acc[type].quantity += s.quantity_liters;
      acc[type].cost += s.total_cost;
      acc[type].averagePrice = acc[type].cost / acc[type].quantity;
      return acc;
    }, {} as Record<string, { quantity: number; cost: number; averagePrice: number }>) || {},
  };

  return (
    <ErrorBoundary fallback={<div>Error loading supplies dashboard</div>}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('supplies.title', 'Fuel Supplies')}
          </h2>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('supplies.addSupply', 'Add Supply')}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <KpiCardGrid summary={summary} isLoading={isLoadingSupplies} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SuppliesTable
            supplies={supplies || []}
            isLoading={isLoadingSupplies}
            tanks={tanks}
          />
        </motion.div>

        <FuelSuppliesManagerStandardized
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSuccess={() => {
            setIsFormOpen(false);
          }}
        />
      </div>
    </ErrorBoundary>
  );
} 