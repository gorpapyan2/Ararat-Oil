/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelDistributionChart } from '@/features/dashboard/components/FuelDistributionChart';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelDistributionChart',
    oldPath: '@/components/dashboard/FuelDistributionChart',
    newPath: '@/features/dashboard/components/FuelDistributionChart',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelDistributionChart;
