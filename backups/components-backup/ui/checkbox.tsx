/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { checkbox } from '@/core/components/ui/checkbox';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'checkbox',
    oldPath: '@/components/ui/checkbox',
    newPath: '@/core/components/ui/checkbox',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default checkbox;
