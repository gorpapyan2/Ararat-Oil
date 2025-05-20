/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { collapsible } from '@/core/components/ui/collapsible';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'collapsible',
    oldPath: '@/components/ui/collapsible',
    newPath: '@/core/components/ui/collapsible',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default collapsible;
