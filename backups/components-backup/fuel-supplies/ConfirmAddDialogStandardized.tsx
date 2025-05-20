/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ConfirmAddDialogStandardized } from '@/features/fuel-supplies/components/ConfirmAddDialogStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ConfirmAddDialogStandardized',
    oldPath: '@/components/fuel-supplies/ConfirmAddDialogStandardized',
    newPath: '@/features/fuel-supplies/components/ConfirmAddDialogStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ConfirmAddDialogStandardized;
