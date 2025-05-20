/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { hover-card } from '@/core/components/ui/hover-card';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'hover-card',
    oldPath: '@/components/ui/hover-card',
    newPath: '@/core/components/ui/hover-card',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default hover-card;
