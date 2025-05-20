/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { label } from '@/core/components/ui/label';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'label',
    oldPath: '@/components/ui/label',
    newPath: '@/core/components/ui/label',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default label;
