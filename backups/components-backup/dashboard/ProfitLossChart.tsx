/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ProfitLossChart } from '@/features/dashboard/components/ProfitLossChart';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ProfitLossChart',
    oldPath: '@/components/dashboard/ProfitLossChart',
    newPath: '@/features/dashboard/components/ProfitLossChart',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ProfitLossChart;
