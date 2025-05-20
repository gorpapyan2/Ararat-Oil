/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { skip-to-content } from '@/core/components/ui/skip-to-content';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'skip-to-content',
    oldPath: '@/components/ui/skip-to-content',
    newPath: '@/core/components/ui/skip-to-content',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default skip-to-content;
