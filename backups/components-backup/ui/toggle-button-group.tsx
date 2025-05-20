/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { toggle-button-group } from '@/core/components/ui/toggle-button-group';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'toggle-button-group',
    oldPath: '@/components/ui/toggle-button-group',
    newPath: '@/core/components/ui/toggle-button-group',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default toggle-button-group;
