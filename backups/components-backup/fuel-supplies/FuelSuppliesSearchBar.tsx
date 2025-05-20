/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelSuppliesSearchBar } from '@/features/fuel-supplies/components/FuelSuppliesSearchBar';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelSuppliesSearchBar',
    oldPath: '@/components/fuel-supplies/FuelSuppliesSearchBar',
    newPath: '@/features/fuel-supplies/components/FuelSuppliesSearchBar',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelSuppliesSearchBar;
