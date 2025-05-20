/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { toast-container } from '@/core/components/ui/toast-container';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'toast-container',
    oldPath: '@/components/ui/toast-container',
    newPath: '@/core/components/ui/toast-container',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default toast-container;
