/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ConfirmationDialogStandardized } from '@/shared/components/dialogs/ConfirmationDialogStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ConfirmationDialogStandardized',
    oldPath: '@/components/dialogs/ConfirmationDialogStandardized',
    newPath: '@/shared/components/dialogs/ConfirmationDialogStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ConfirmationDialogStandardized;
