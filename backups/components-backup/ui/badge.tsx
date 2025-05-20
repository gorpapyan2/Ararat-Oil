/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { badge } from '@/core/components/ui/badge';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'badge',
    oldPath: '@/components/ui/badge',
    newPath: '@/core/components/ui/badge',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default badge;
