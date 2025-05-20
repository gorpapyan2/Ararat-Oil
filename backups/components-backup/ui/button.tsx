/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { button } from '@/core/components/ui/button';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'button',
    oldPath: '@/components/ui/button',
    newPath: '@/core/components/ui/button',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default button;
