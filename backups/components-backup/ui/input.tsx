/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { input } from '@/core/components/ui/input';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'input',
    oldPath: '@/components/ui/input',
    newPath: '@/core/components/ui/input',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default input;
