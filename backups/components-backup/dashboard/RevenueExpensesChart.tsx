/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { RevenueExpensesChart } from '@/features/dashboard/components/RevenueExpensesChart';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'RevenueExpensesChart',
    oldPath: '@/components/dashboard/RevenueExpensesChart',
    newPath: '@/features/dashboard/components/RevenueExpensesChart',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default RevenueExpensesChart;
