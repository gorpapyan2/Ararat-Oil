/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { FuelSuppliesDebugger } from '@/features/fuel-supplies/components/FuelSuppliesDebugger';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'FuelSuppliesDebugger',
    oldPath: '@/components/fuel-supplies/FuelSuppliesDebugger',
    newPath: '@/features/fuel-supplies/components/FuelSuppliesDebugger',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default FuelSuppliesDebugger;
