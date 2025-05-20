/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { alert-dialog } from '@/core/components/ui/alert-dialog';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'alert-dialog',
    oldPath: '@/components/ui/alert-dialog',
    newPath: '@/core/components/ui/alert-dialog',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default alert-dialog;
