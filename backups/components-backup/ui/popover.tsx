/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { popover } from '@/core/components/ui/popover';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'popover',
    oldPath: '@/components/ui/popover',
    newPath: '@/core/components/ui/popover',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default popover;
