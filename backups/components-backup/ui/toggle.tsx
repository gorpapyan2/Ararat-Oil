/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { toggle } from '@/core/components/ui/toggle';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'toggle',
    oldPath: '@/components/ui/toggle',
    newPath: '@/core/components/ui/toggle',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default toggle;
