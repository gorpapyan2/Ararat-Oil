/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelSuppliesProviderSelect } from '@/features/fuel-supplies/components/FuelSuppliesProviderSelect';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelSuppliesProviderSelect',
    oldPath: '@/components/fuel-supplies/FuelSuppliesProviderSelect',
    newPath: '@/features/fuel-supplies/components/FuelSuppliesProviderSelect',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelSuppliesProviderSelect;
