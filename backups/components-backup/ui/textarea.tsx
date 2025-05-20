/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { textarea } from '@/core/components/ui/textarea';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'textarea',
    oldPath: '@/components/ui/textarea',
    newPath: '@/core/components/ui/textarea',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default textarea;
