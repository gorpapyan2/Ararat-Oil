/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ResponsiveTester } from '@/shared/components/dev/ResponsiveTester';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'ResponsiveTester',
    oldPath: '@/components/dev/ResponsiveTester',
    newPath: '@/shared/components/dev/ResponsiveTester',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ResponsiveTester;
