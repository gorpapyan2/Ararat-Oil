/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { progress } from '@/core/components/ui/progress';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'progress',
    oldPath: '@/components/ui/progress',
    newPath: '@/core/components/ui/progress',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default progress;
