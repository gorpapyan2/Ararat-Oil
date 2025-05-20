/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { menubar } from '@/core/components/ui/menubar';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'menubar',
    oldPath: '@/components/ui/menubar',
    newPath: '@/core/components/ui/menubar',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default menubar;
