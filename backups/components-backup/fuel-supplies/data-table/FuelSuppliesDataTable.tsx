/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelSuppliesDataTable } from '@/features/fuel-supplies/components/FuelSuppliesDataTable';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelSuppliesDataTable',
    oldPath: '@/components/fuel-supplies/FuelSuppliesDataTable',
    newPath: '@/features/fuel-supplies/components/FuelSuppliesDataTable',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelSuppliesDataTable;
