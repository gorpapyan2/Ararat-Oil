/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { SidebarNavSection } from '@/shared/components/sidebar/SidebarNavSection';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'SidebarNavSection',
    oldPath: '@/components/sidebar/SidebarNavSection',
    newPath: '@/shared/components/sidebar/SidebarNavSection',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default SidebarNavSection;
