/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ProfileDialogStandardized } from '@/features/auth/components/ProfileDialogStandardized';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ProfileDialogStandardized',
    oldPath: '@/components/settings/ProfileDialogStandardized',
    newPath: '@/features/auth/components/ProfileDialogStandardized',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ProfileDialogStandardized;
