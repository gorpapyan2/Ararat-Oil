/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { context-menu } from '@/core/components/ui/context-menu';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'context-menu',
    oldPath: '@/components/ui/context-menu',
    newPath: '@/core/components/ui/context-menu',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default context-menu;
