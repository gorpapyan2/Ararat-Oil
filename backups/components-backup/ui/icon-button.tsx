/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { icon-button } from '@/core/components/ui/icon-button';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'icon-button',
    oldPath: '@/components/ui/icon-button',
    newPath: '@/core/components/ui/icon-button',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default icon-button;
