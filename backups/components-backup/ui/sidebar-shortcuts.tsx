/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { sidebar-shortcuts } from '@/core/components/ui/sidebar-shortcuts';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'sidebar-shortcuts',
    oldPath: '@/components/ui/sidebar-shortcuts',
    newPath: '@/core/components/ui/sidebar-shortcuts',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default sidebar-shortcuts;
