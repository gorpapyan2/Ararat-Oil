/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { dialog } from '@/core/components/ui/dialog';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'dialog',
    oldPath: '@/components/ui/dialog',
    newPath: '@/core/components/ui/dialog',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default dialog;
