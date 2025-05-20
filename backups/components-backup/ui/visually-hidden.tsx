/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { visually-hidden } from '@/core/components/ui/visually-hidden';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'visually-hidden',
    oldPath: '@/components/ui/visually-hidden',
    newPath: '@/core/components/ui/visually-hidden',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default visually-hidden;
