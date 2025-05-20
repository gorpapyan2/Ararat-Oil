/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelSuppliesRangesFilters } from '@/features/fuel-supplies/components/FuelSuppliesRangesFilters';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelSuppliesRangesFilters',
    oldPath: '@/components/fuel-supplies/FuelSuppliesRangesFilters',
    newPath: '@/features/fuel-supplies/components/FuelSuppliesRangesFilters',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelSuppliesRangesFilters;
