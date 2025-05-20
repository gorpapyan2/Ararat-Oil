/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { toggle-button } from '@/core/components/ui/toggle-button';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'toggle-button',
    oldPath: '@/components/ui/toggle-button',
    newPath: '@/core/components/ui/toggle-button',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default toggle-button;
