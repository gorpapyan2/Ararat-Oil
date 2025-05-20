/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { dev-menu } from '@/core/components/ui/dev-menu';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'dev-menu',
    oldPath: '@/components/ui/dev-menu',
    newPath: '@/core/components/ui/dev-menu',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default dev-menu;
