/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { SidebarLogo } from '@/shared/components/sidebar/SidebarLogo';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'SidebarLogo',
    oldPath: '@/components/sidebar/SidebarLogo',
    newPath: '@/shared/components/sidebar/SidebarLogo',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default SidebarLogo;
