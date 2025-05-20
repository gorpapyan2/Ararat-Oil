/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ProfileController } from '@/features/auth/components/ProfileController';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ProfileController',
    oldPath: '@/components/settings/ProfileController',
    newPath: '@/features/auth/components/ProfileController',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ProfileController;
