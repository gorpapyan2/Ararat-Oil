/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { connectivity-debugger } from '@/core/components/ui/connectivity-debugger';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'connectivity-debugger',
    oldPath: '@/components/ui/connectivity-debugger',
    newPath: '@/core/components/ui/connectivity-debugger',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default connectivity-debugger;
