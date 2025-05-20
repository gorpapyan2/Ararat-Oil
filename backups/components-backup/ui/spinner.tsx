/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { spinner } from '@/core/components/ui/spinner';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'spinner',
    oldPath: '@/components/ui/spinner',
    newPath: '@/core/components/ui/spinner',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default spinner;
