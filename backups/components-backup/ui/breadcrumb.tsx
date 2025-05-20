/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { breadcrumb } from '@/core/components/ui/breadcrumb';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'breadcrumb',
    oldPath: '@/components/ui/breadcrumb',
    newPath: '@/core/components/ui/breadcrumb',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default breadcrumb;
