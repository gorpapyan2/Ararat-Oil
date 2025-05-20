/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelSuppliesSummary } from '@/features/fuel-supplies/components/FuelSuppliesSummary';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelSuppliesSummary',
    oldPath: '@/components/fuel-supplies/FuelSuppliesSummary',
    newPath: '@/features/fuel-supplies/components/FuelSuppliesSummary',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelSuppliesSummary;
