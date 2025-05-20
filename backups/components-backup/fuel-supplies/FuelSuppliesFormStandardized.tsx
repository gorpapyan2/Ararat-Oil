/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelSuppliesFormStandardized } from '@/features/fuel-supplies/components/FuelSuppliesFormStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelSuppliesFormStandardized',
    oldPath: '@/components/fuel-supplies/FuelSuppliesFormStandardized',
    newPath: '@/features/fuel-supplies/components/FuelSuppliesFormStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelSuppliesFormStandardized;
