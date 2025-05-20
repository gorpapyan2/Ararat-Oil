/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelSuppliesTable } from '@/features/fuel-supplies/components/FuelSuppliesTable';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelSuppliesTable',
    oldPath: '@/components/fuel-supplies/FuelSuppliesTable',
    newPath: '@/features/fuel-supplies/components/FuelSuppliesTable',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelSuppliesTable;
