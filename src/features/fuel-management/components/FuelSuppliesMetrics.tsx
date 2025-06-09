import React from 'react';
import { Fuel, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { MetricCard } from '@/core/components/ui/enhanced/metric-card';

export interface SupplyListItem {
  id: string;
  supplier: string;
  fuelType: string;
  quantity: number;
  pricePerLiter: number;
  totalCost: number;
  deliveryDate: string;
  status: 'received' | 'pending' | 'verified';
}

interface FuelSuppliesMetricsProps {
  supplies: SupplyListItem[];
  isLoading: boolean;
}

export const FuelSuppliesMetrics: React.FC<FuelSuppliesMetricsProps> = ({ supplies, isLoading }) => {
  const activeSupplies = supplies.filter(s => s.status === 'received');
  const totalLiters = activeSupplies.reduce((sum, supply) => sum + supply.quantity, 0);
  const totalCost = activeSupplies.reduce((sum, supply) => sum + supply.totalCost, 0);
  const averageCostPerLiter = totalLiters > 0 ? totalCost / totalLiters : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Supplies"
        icon={Fuel}
        value={isLoading ? '...' : supplies.length.toString()}
        description="Current inventory entries"
      />
      <MetricCard
        title="Total Fuel Volume"
        icon={TrendingUp}
        value={isLoading ? '...' : `${totalLiters.toLocaleString()} L`}
        description="Total liters received"
      />
      <MetricCard
        title="Total Cost"
        icon={DollarSign}
        value={isLoading ? '...' : `${totalCost.toLocaleString()} ֏`}
        description="Total value of supplies"
      />
      <MetricCard
        title="Avg. Cost/Liter"
        icon={TrendingDown}
        value={isLoading ? '...' : `${averageCostPerLiter.toFixed(3)} ֏`}
        description="Average price per liter"
      />
    </div>
  );
}; 