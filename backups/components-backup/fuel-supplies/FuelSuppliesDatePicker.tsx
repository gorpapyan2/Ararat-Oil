/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelSuppliesDatePicker } from '@/features/fuel-supplies/components/FuelSuppliesDatePicker';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelSuppliesDatePicker',
    oldPath: '@/components/fuel-supplies/FuelSuppliesDatePicker',
    newPath: '@/features/fuel-supplies/components/FuelSuppliesDatePicker',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelSuppliesDatePicker;
