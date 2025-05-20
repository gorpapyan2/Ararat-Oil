/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ConfirmDeleteDialogStandardized } from '@/features/fuel-supplies/components/ConfirmDeleteDialogStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ConfirmDeleteDialogStandardized',
    oldPath: '@/components/fuel-supplies/ConfirmDeleteDialogStandardized',
    newPath: '@/features/fuel-supplies/components/ConfirmDeleteDialogStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ConfirmDeleteDialogStandardized;
