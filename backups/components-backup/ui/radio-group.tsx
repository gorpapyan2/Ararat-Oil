/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { radio-group } from '@/core/components/ui/radio-group';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'radio-group',
    oldPath: '@/components/ui/radio-group',
    newPath: '@/core/components/ui/radio-group',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default radio-group;
