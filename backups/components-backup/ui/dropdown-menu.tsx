/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { dropdown-menu } from '@/core/components/ui/dropdown-menu';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'dropdown-menu',
    oldPath: '@/components/ui/dropdown-menu',
    newPath: '@/core/components/ui/dropdown-menu',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default dropdown-menu;
