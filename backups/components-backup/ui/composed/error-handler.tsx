/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { error-handler } from '@/core/components/ui/error-handler';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'error-handler',
    oldPath: '@/components/ui/error-handler',
    newPath: '@/core/components/ui/error-handler',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default error-handler;
