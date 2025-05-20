/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ProviderManagerStandardized } from '@/features/petrol-providers/components/ProviderManagerStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ProviderManagerStandardized',
    oldPath: '@/components/petrol-providers/ProviderManagerStandardized',
    newPath: '@/features/petrol-providers/components/ProviderManagerStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ProviderManagerStandardized;
