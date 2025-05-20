/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { select } from '@/core/components/ui/select';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'select',
    oldPath: '@/components/ui/select',
    newPath: '@/core/components/ui/select',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default select;
