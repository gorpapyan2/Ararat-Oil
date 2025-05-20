/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { DeliveryDateProvider } from '@/features/fuel-supplies/components/DeliveryDateProvider';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'DeliveryDateProvider',
    oldPath: '@/components/fuel-supplies/DeliveryDateProvider',
    newPath: '@/features/fuel-supplies/components/DeliveryDateProvider',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default DeliveryDateProvider;
