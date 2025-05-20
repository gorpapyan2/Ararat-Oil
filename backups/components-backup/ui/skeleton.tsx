/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { skeleton } from '@/core/components/ui/skeleton';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'skeleton',
    oldPath: '@/components/ui/skeleton',
    newPath: '@/core/components/ui/skeleton',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default skeleton;
