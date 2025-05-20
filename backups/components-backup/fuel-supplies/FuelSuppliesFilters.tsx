/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelSuppliesFilters } from '@/features/fuel-supplies/components/FuelSuppliesFilters';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelSuppliesFilters',
    oldPath: '@/components/fuel-supplies/FuelSuppliesFilters',
    newPath: '@/features/fuel-supplies/components/FuelSuppliesFilters',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelSuppliesFilters;
