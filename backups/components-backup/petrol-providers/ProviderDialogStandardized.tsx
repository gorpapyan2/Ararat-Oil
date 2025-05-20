/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ProviderDialogStandardized } from '@/features/petrol-providers/components/ProviderDialogStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ProviderDialogStandardized',
    oldPath: '@/components/petrol-providers/ProviderDialogStandardized',
    newPath: '@/features/petrol-providers/components/ProviderDialogStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ProviderDialogStandardized;
