/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { DevToolsMenu } from '@/shared/components/dev/DevToolsMenu';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'DevToolsMenu',
    oldPath: '@/components/dev/DevToolsMenu',
    newPath: '@/shared/components/dev/DevToolsMenu',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default DevToolsMenu;
