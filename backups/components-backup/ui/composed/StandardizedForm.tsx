/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { StandardizedForm } from '@/core/components/ui/StandardizedForm';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'StandardizedForm',
    oldPath: '@/components/ui/StandardizedForm',
    newPath: '@/core/components/ui/StandardizedForm',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default StandardizedForm;
