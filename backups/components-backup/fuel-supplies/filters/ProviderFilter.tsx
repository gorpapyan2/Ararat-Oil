/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ProviderFilter } from '@/features/fuel-supplies/components/ProviderFilter';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ProviderFilter',
    oldPath: '@/components/fuel-supplies/ProviderFilter',
    newPath: '@/features/fuel-supplies/components/ProviderFilter',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ProviderFilter;
