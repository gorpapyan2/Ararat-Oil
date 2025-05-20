/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { action-button } from '@/core/components/ui/action-button';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'action-button',
    oldPath: '@/components/ui/action-button',
    newPath: '@/core/components/ui/action-button',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default action-button;
