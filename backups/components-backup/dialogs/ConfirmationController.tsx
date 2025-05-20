/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ConfirmationController } from '@/shared/components/dialogs/ConfirmationController';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ConfirmationController',
    oldPath: '@/components/dialogs/ConfirmationController',
    newPath: '@/shared/components/dialogs/ConfirmationController',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ConfirmationController;
