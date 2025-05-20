/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { sidebar-section } from '@/core/components/ui/sidebar-section';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'sidebar-section',
    oldPath: '@/components/ui/sidebar-section',
    newPath: '@/core/components/ui/sidebar-section',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default sidebar-section;
