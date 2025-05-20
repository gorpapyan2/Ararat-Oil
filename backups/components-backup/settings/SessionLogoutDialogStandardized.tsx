/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { SessionLogoutDialogStandardized } from '@/features/auth/components/SessionLogoutDialogStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'SessionLogoutDialogStandardized',
    oldPath: '@/components/settings/SessionLogoutDialogStandardized',
    newPath: '@/features/auth/components/SessionLogoutDialogStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default SessionLogoutDialogStandardized;
