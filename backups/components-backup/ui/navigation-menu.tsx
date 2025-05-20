/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { navigation-menu } from '@/core/components/ui/navigation-menu';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'navigation-menu',
    oldPath: '@/components/ui/navigation-menu',
    newPath: '@/core/components/ui/navigation-menu',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default navigation-menu;
