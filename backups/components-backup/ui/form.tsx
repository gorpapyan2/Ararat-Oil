/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { form } from '@/core/components/ui/form';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'form',
    oldPath: '@/components/ui/form',
    newPath: '@/core/components/ui/form',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default form;
