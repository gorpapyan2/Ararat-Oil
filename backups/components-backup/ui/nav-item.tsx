/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { nav-item } from '@/core/components/ui/nav-item';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'nav-item',
    oldPath: '@/components/ui/nav-item',
    newPath: '@/core/components/ui/nav-item',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default nav-item;
