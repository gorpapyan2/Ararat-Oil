/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { button-group } from '@/core/components/ui/button-group';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'button-group',
    oldPath: '@/components/ui/button-group',
    newPath: '@/core/components/ui/button-group',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default button-group;
